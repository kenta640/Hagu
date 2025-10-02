"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Loading } from "@/components/Loading";
import { Conversation } from "@/types";
import { formatDate } from "@/lib/utils";

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/messages/conversations")
      .then((res) => res.json())
      .then((data) => {
        setConversations(data);
        setLoading(false);
      });
  }, []);

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
      <div className="p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">メッセージ</h1>

        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-gray-600">メッセージはまだありません</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md divide-y">
            {conversations.map((conversation) => (
              <div
                key={conversation.userId}
                onClick={() => router.push(`/messages/${conversation.userId}`)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-orange-500"
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
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-gray-900">
                        {conversation.user.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatDate(conversation.lastMessage.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage.content}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
