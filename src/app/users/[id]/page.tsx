"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/button";
import { Loading } from "@/components/Loading";
import { User } from "@/types";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/users/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setLoading(false);
        });
    }
  }, [params.id]);

  const handleLike = async () => {
    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: params.id }),
      });

      const data = await response.json();
      if (data.isMatched) {
        alert("マッチングしました！ 🎉");
        router.push("/matches");
      } else {
        alert("いいねを送信しました！");
        router.back();
      }
    } catch (error) {
      alert("いいねの送信に失敗しました");
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:ml-64">
        <Navigation />
        <div className="text-center py-12">
          <p className="text-gray-600">ユーザーが見つかりませんでした</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:ml-64">
      <Navigation />
      <div className="p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            ← 戻る
          </Button>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-64 bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center">
              <svg
                className="w-32 h-32 text-orange-500"
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

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-lg text-gray-600">
                    {user.age}歳 {user.gender && `• ${user.gender}`}
                  </p>
                  {user.location && (
                    <p className="text-gray-600">📍 {user.location}</p>
                  )}
                </div>
              </div>

              {user.bio && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">
                    自己紹介
                  </h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{user.bio}</p>
                </div>
              )}

              {user.interests && user.interests.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">
                    興味・関心
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest) => (
                      <span
                        key={interest.id}
                        className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                      >
                        {interest.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  onClick={handleLike}
                  className="flex-1"
                  size="lg"
                >
                  💝 ハグする
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
