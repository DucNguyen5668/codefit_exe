"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import api from "@/lib/api";

const createAiGreeting = (name) => ({
  _id: "ai_welcome",
  content: name
    ? `Xin chào ${name}! Tôi là trợ lý AI 24/7 của Nutricore Tây Nguyên. Tôi có thể giúp gì cho bạn hôm nay?`
    : "Xin chào! Tôi là trợ lý AI 24/7 của Nutricore Tây Nguyên. Tôi có thể giúp gì cho bạn hôm nay?",
  sender: { role: "ai" },
  createdAt: new Date().toISOString()
});

const readAiMessages = () => {
  if (typeof window === "undefined") return [];
  try {
    const stored = sessionStorage.getItem("nutricore_ai_chat_history");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to read AI chat history:", error);
    return [];
  }
};

export default function ChatWidget() {
  const { user, isLoggedIn } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const isCustomerCare = pathname === "/customer-care";

  // --- ADMIN MODE STATE & EFFECTS ---
  const [adminMessages, setAdminMessages] = useState([]);
  const [adminConversationId, setAdminConversationId] = useState(null);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load admin conversation
  const loadAdminConversation = useCallback(async () => {
    try {
      setLoadingAdmin(true);
      const data = await api.get("/messages/conversations");
      if (data.conversations && data.conversations.length > 0) {
        const conv = data.conversations[0];
        setAdminConversationId(conv._id);
        const msgData = await api.get(`/messages/${conv._id}`);
        setAdminMessages(msgData.messages || []);
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Load admin conversation error:", err);
    } finally {
      setLoadingAdmin(false);
    }
  }, []);

  // Poll unread count for admin mode
  useEffect(() => {
    if (!isLoggedIn || user?.role === "admin" || !isCustomerCare) return;

    const controller = new AbortController();

    const checkUnread = async () => {
      try {
        const data = await api.get("/messages/unread/count");
        setUnreadCount(data.unreadCount || 0);
      } catch (e) {
        // silently fail
      }
    };

    checkUnread();
    const interval = setInterval(checkUnread, 15000);
    return () => {
      clearInterval(interval);
      controller.abort();
    };
  }, [isLoggedIn, user, isCustomerCare]);

  // Load admin conversation when opened in customer care
  useEffect(() => {
    if (isOpen && isCustomerCare && isLoggedIn && user?.role !== "admin") {
      queueMicrotask(loadAdminConversation);
    }
  }, [isOpen, isCustomerCare, isLoggedIn, user, loadAdminConversation]);

  // --- AI MODE STATE & EFFECTS ---
  const [aiMessages, setAiMessages] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAiMessages(readAiMessages());
  }, []);

  // Ensure AI mode always has an initial greeting after user data is known.
  useEffect(() => {
    if (!mounted || isCustomerCare || aiMessages.length > 0) return;

    queueMicrotask(() => {
      setAiMessages((current) => {
        if (current.length > 0) return current;
        const greeting = createAiGreeting(user?.name);
        sessionStorage.setItem("nutricore_ai_chat_history", JSON.stringify([greeting]));
        return [greeting];
      });
    });
  }, [mounted, isCustomerCare, aiMessages.length, user?.name]);

  // Scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [adminMessages, aiMessages, loadingAI, isOpen]);

  // Input states
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    const content = input.trim();
    setInput("");

    if (isCustomerCare) {
      // --- SEND ADMIN MESSAGE ---
      if (!isLoggedIn) return;
      const tempMessage = {
        _id: "temp_" + Date.now(),
        content,
        sender: { _id: user._id, name: user.name, role: "customer" },
        createdAt: new Date().toISOString()
      };
      setAdminMessages(prev => [...prev, tempMessage]);

      try {
        const data = await api.post("/messages/send", { conversationId: adminConversationId, content });
        if (data.conversationId) {
          setAdminConversationId(data.conversationId);
        }
        setAdminMessages(prev => prev.map(m => m._id === tempMessage._id ? data.message : m));
      } catch (err) {
        console.error("Send admin message error:", err);
        setAdminMessages(prev => prev.filter(m => m._id !== tempMessage._id));
      }
    } else {
      // --- SEND AI MESSAGE ---
      const userMessage = {
        _id: "user_" + Date.now(),
        content,
        sender: { role: "user" },
        createdAt: new Date().toISOString()
      };
      const updatedMessages = [...aiMessages, userMessage];
      setAiMessages(updatedMessages);
      sessionStorage.setItem("nutricore_ai_chat_history", JSON.stringify(updatedMessages));

      setLoadingAI(true);
      try {
        // Send history format suitable for API (role & content)
        const apiMessages = updatedMessages.map(m => ({
          role: m.sender.role === "ai" ? "assistant" : "user",
          content: m.content
        }));

        const data = await api.post("/chatbot/chat", { messages: apiMessages });
        const aiMessage = {
          _id: "ai_" + Date.now(),
          content: data.reply,
          sender: { role: "ai" },
          createdAt: new Date().toISOString()
        };

        const finalMessages = [...updatedMessages, aiMessage];
        setAiMessages(finalMessages);
        sessionStorage.setItem("nutricore_ai_chat_history", JSON.stringify(finalMessages));
      } catch (err) {
        console.error("AI Chat error:", err);
        const errorMessage = {
          _id: "ai_err_" + Date.now(),
          content: "Rất tiếc, tôi đang gặp lỗi kết nối. Vui lòng thử lại sau giây lát!",
          sender: { role: "ai" },
          createdAt: new Date().toISOString()
        };
        setAiMessages(prev => [...prev, errorMessage]);
      } finally {
        setLoadingAI(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Hide widget completely for admin users
  if (user?.role === "admin") return null;

  // For Admin Chat on Customer Care page, hide if not logged in
  if (isCustomerCare && !isLoggedIn) {
    return null;
  }

  const activeMessages = isCustomerCare ? adminMessages : aiMessages;
  const widgetTitle = isCustomerCare ? "Hỗ trợ khách hàng" : "Trợ lý AI 24/7";
  const widgetSubtitle = isCustomerCare ? "Nutricore Tây Nguyên" : "Phản hồi ngay lập tức";
  const displayLoading = isCustomerCare ? loadingAdmin : false;

  // Theme colors
  const mainBgStyle = {
    background: isCustomerCare 
      ? "linear-gradient(135deg, var(--primary-green), var(--primary-green-light))" 
      : "linear-gradient(135deg, #a66b2f, #d59b5d)"
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chat-widget-btn"
        id="chat-widget-toggle"
        style={mainBgStyle}
      >
        {isOpen ? (
          <i className="fas fa-times text-xl"></i>
        ) : (
          <>
            {isCustomerCare ? (
              <i className="fas fa-headset text-xl"></i>
            ) : (
              <i className="fas fa-robot text-xl"></i>
            )}
            {isCustomerCare && unreadCount > 0 && (
              <span className="chat-widget-badge">{unreadCount}</span>
            )}
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-widget-window animate-fadeIn">
          {/* Header */}
          <div className="chat-widget-header" style={mainBgStyle}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                {isCustomerCare ? (
                  <i className="fas fa-headset text-lg"></i>
                ) : (
                  <i className="fas fa-robot text-lg"></i>
                )}
              </div>
              <div>
                <h4 className="font-bold text-sm">{widgetTitle}</h4>
                <p className="text-xs opacity-80">{widgetSubtitle}</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
              <i className="fas fa-minus"></i>
            </button>
          </div>

          {/* Messages */}
          <div className="chat-widget-messages">
            {displayLoading ? (
              <div className="flex items-center justify-center h-full">
                <i className="fas fa-spinner fa-spin text-2xl text-gray-300"></i>
              </div>
            ) : activeMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-16 h-16 rounded-full bg-[#45572f]/10 flex items-center justify-center mb-4">
                  <i className="fas fa-hand-sparkles text-2xl text-[#45572f]"></i>
                </div>
                <p className="text-sm text-gray-500 font-medium">Xin chào {user?.name || "bạn"}!</p>
                <p className="text-xs text-gray-400 mt-1">Hãy gửi tin nhắn để bắt đầu.</p>
              </div>
            ) : (
              activeMessages.map((msg) => {
                const isLeft = isCustomerCare 
                  ? msg.sender?.role === "admin"
                  : msg.sender?.role === "ai";

                // Message styles
                const leftBubbleStyle = isLeft 
                  ? {} 
                  : (isCustomerCare ? {} : { background: "#a66b2f" });

                return (
                  <div
                    key={msg._id}
                    className={`chat-bubble ${isLeft ? "chat-bubble-left" : "chat-bubble-right"}`}
                  >
                    <div className="chat-bubble-content" style={leftBubbleStyle}>
                      <p className="whitespace-pre-line">{msg.content}</p>
                      <span className="chat-bubble-time">
                        {new Date(msg.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}

            {/* AI Typing Indicator */}
            {!isCustomerCare && loadingAI && (
              <div className="chat-bubble chat-bubble-left">
                <div className="chat-bubble-content">
                  <div className="flex gap-1 items-center py-1">
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-widget-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isCustomerCare ? "Nhập tin nhắn..." : "Hỏi trợ lý AI..."}
              className="flex-1 text-sm outline-none bg-transparent"
              disabled={!isCustomerCare && loadingAI}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || (!isCustomerCare && loadingAI)}
              className="chat-send-btn"
              style={mainBgStyle}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

