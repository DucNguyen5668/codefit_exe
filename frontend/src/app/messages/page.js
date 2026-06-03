"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function MessagesPage() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const loadMessages = useCallback(async () => {
    try {
      const data = await api.get("/messages/conversations");
      if (data.conversations && data.conversations.length > 0) {
        const conv = data.conversations[0];
        setConversationId(conv._id);
        const msgData = await api.get(`/messages/${conv._id}`);
        setMessages(msgData.messages || []);
      }
    } catch (err) {
      console.error("Load messages error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    queueMicrotask(loadMessages);
    // Poll for new messages every 5 seconds
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [isLoggedIn, loadMessages, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const content = input.trim();
    setInput("");

    const tempMsg = {
      _id: "temp_" + Date.now(),
      content,
      sender: { _id: user._id, name: user.name, role: user.role },
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      const data = await api.post("/messages/send", { conversationId, content });
      if (data.conversationId) setConversationId(data.conversationId);
      setMessages(prev => prev.map(m => m._id === tempMsg._id ? data.message : m));
    } catch (err) {
      setMessages(prev => prev.filter(m => m._id !== tempMsg._id));
    }
  };

  return (
    <div>
      <section className="page-banner">
        <div className="max-w-[1200px] mx-auto px-4 banner-inner">
          <h1 className="banner-title">Tin Nhắn</h1>
          <div className="breadcrumbs">
            <Link href="/">Trang chủ</Link>
            <i className="fas fa-chevron-right text-xs"></i>
            <span>Tin nhắn</span>
          </div>
        </div>
      </section>

      <section className="max-w-[800px] mx-auto px-4 section-padding">
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm" style={{ height: "600px", display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <div className="bg-[#45572f] text-white px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <i className="fas fa-headset text-lg"></i>
            </div>
            <div>
              <h3 className="font-bold">Hỗ Trợ Khách Hàng</h3>
              <p className="text-xs opacity-80">Nutricore Tây Nguyên - Thường trả lời trong vài phút</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <i className="fas fa-spinner fa-spin text-3xl text-gray-300"></i>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 rounded-full bg-[#45572f]/10 flex items-center justify-center mb-4">
                  <i className="fas fa-comments text-3xl text-[#45572f]"></i>
                </div>
                <p className="text-gray-500 font-medium">Chưa có tin nhắn</p>
                <p className="text-sm text-gray-400 mt-1">Gửi tin nhắn để được hỗ trợ nhanh nhất!</p>
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg._id} className={`flex ${msg.sender?.role === "admin" ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[70%] ${msg.sender?.role === "admin" ? "bg-white border border-gray-200" : "bg-[#45572f] text-white"} rounded-2xl px-4 py-3 shadow-sm`}>
                    {msg.sender?.role === "admin" && (
                      <p className="text-xs font-bold text-[#45572f] mb-1">
                        <i className="fas fa-shield-alt mr-1"></i>Admin
                      </p>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-[10px] mt-1 ${msg.sender?.role === "admin" ? "text-gray-400" : "text-white/60"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4 bg-white flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-full text-sm outline-none focus:border-[#45572f] transition-colors"
            />
            <button onClick={handleSend} disabled={!input.trim()} className="bg-[#45572f] text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#607a44] transition-colors disabled:opacity-40">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
