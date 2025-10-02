"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Navigation } from "@/components/Navigation";
import { Loading } from "@/components/Loading";
import { Message, User } from "@/types";
import { formatDate } from "@/lib/utils";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (params.userId) {
      fetchMessages();
      fetchUser();
      markAsRead();
      
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [params.userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    const response = await fetch(`/api/messages/${params.userId}`);
    const data = await response.json();
    setMessages(data);
    setLoading(false);
  };

  const fetchUser = async () => {
    const response = await fetch(`/api/users/${params.userId}`);
    const data = await response.json();
    setOtherUser(data);
  };

  const markAsRead = async () => {
    await fetch(`/api/messages/read/${params.userId}`, { method: "PUT" });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: params.userId,
          content: newMessage,
        }),
      });

      setNewMessage("");
      fetchMessages();
    } catch (error) {
      alert("メッセージの送信に失敗しました");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:ml-64">
        <Navigation />
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:ml-64">
      <Navigation />
      <div className="flex flex-col h-screen">
        <div className="bg-white border-b p-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-orange-500 hover:text-orange-600"
          >
            ←
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-orange-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="font-bold text-lg">{otherUser?.name}</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => {
            const isOwn = message.senderId === session?.user?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                    isOwn
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <p className="break-words">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwn ? "text-orange-100" : "text-gray-500"
                    }`}
                  >
                    {formatDate(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="bg-white border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="メッセージを入力..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              送信
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
