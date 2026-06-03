"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function AdminMessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const loadMessages = useCallback(async (convId) => {
    try {
      setMsgLoading((prev) => prev || messagesEndRef.current === null);
      const data = await api.get(`/messages/${convId}`);
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Load messages error:", err);
    } finally {
      setMsgLoading(false);
    }
  }, []);

  const selectConversation = useCallback(async (conv) => {
    setActiveConv(conv);
    await loadMessages(conv._id);
  }, [loadMessages]);

  const fetchConversations = useCallback(async () => {
    try {
      const data = await api.get("/messages/conversations");
      const nextConversations = data.conversations || [];
      setConversations(nextConversations);
      // Auto-select first conversation
      setActiveConv((current) => {
        if (current || nextConversations.length === 0) return current;
        loadMessages(nextConversations[0]._id);
        return nextConversations[0];
      });
    } catch (err) {
      console.error("Fetch conversations error:", err);
    } finally {
      setLoading(false);
    }
  }, [loadMessages]);

  useEffect(() => { queueMicrotask(fetchConversations); }, [fetchConversations]);
  useEffect(() => {
    if (!activeConv) return;
    const interval = setInterval(() => loadMessages(activeConv._id), 5000);
    return () => clearInterval(interval);
  }, [activeConv, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !activeConv) return;
    const content = input.trim();
    setInput("");

    const tempMsg = {
      _id: "temp_" + Date.now(),
      content,
      sender: { _id: user._id, name: user.name, role: "admin" },
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      const data = await api.post("/messages/send", { conversationId: activeConv._id, content });
      setMessages(prev => prev.map(m => m._id === tempMsg._id ? data.message : m));
      fetchConversations(); // Refresh conversation list
    } catch (err) {
      setMessages(prev => prev.filter(m => m._id !== tempMsg._id));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold font-montserrat text-gray-900 mb-8">
        <i className="fas fa-comments text-[#45572f] mr-3"></i>Tin Nhắn Khách Hàng
      </h1>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden" style={{ height: "600px" }}>
        <div className="flex h-full">
          {/* Conversation List */}
          <div className="w-[300px] border-r border-gray-200 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-sm text-gray-700">Cuộc trò chuyện</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-10"><i className="fas fa-spinner fa-spin text-xl text-gray-300"></i></div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">Chưa có tin nhắn</div>
              ) : (
                conversations.map(conv => (
                  <button
                    key={conv._id}
                    onClick={() => selectConversation(conv)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      activeConv?._id === conv._id ? "bg-[#45572f]/5 border-l-4 border-l-[#45572f]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#45572f] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {conv.customer?.name?.charAt(0) || "K"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm text-gray-900 truncate">{conv.customer?.name || "Khách hàng"}</p>
                        <p className="text-xs text-gray-500 truncate">{conv.lastMessage || "..."}</p>
                      </div>
                      {conv.unreadByAdmin > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                          {conv.unreadByAdmin}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {activeConv ? (
              <>
                {/* Chat Header */}
                <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#45572f] text-white flex items-center justify-center font-bold text-xs">
                    {activeConv.customer?.name?.charAt(0) || "K"}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{activeConv.customer?.name}</p>
                    <p className="text-xs text-gray-500">{activeConv.customer?.email}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                  {msgLoading ? (
                    <div className="flex justify-center py-10"><i className="fas fa-spinner fa-spin text-xl text-gray-300"></i></div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-sm">Chưa có tin nhắn trong cuộc trò chuyện này</div>
                  ) : (
                    messages.map(msg => (
                      <div key={msg._id} className={`flex ${msg.sender?.role === "admin" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] ${msg.sender?.role === "admin" ? "bg-[#45572f] text-white" : "bg-white border border-gray-200"} rounded-2xl px-4 py-3 shadow-sm`}>
                          {msg.sender?.role !== "admin" && (
                            <p className="text-xs font-bold text-[#45572f] mb-1">{msg.sender?.name || "Khách hàng"}</p>
                          )}
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-[10px] mt-1 ${msg.sender?.role === "admin" ? "text-white/60" : "text-gray-400"}`}>
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
                    placeholder="Trả lời khách hàng..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-full text-sm outline-none focus:border-[#45572f] transition-colors"
                  />
                  <button onClick={handleSend} disabled={!input.trim()} className="bg-[#45572f] text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#607a44] transition-colors disabled:opacity-40">
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <i className="fas fa-comments text-4xl mb-4"></i>
                  <p>Chọn một cuộc trò chuyện để bắt đầu</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
