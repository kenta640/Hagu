"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Loading } from "@/components/Loading";
import { Match } from "@/types";
import { formatDate } from "@/lib/utils";

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/matches")
      .then((res) => res.json())
      .then((data) => {
        setMatches(data);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">マッチング</h1>

        {matches.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💔</div>
            <p className="text-gray-600">まだマッチングがありません</p>
            <button
              onClick={() => router.push("/discover")}
              className="mt-4 text-orange-500 hover:text-orange-600 font-medium"
            >
              ユーザーを探す →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <div
                key={match.user.id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(`/users/${match.user.id}`)}
              >
                <div className="h-48 bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center">
                  <svg
                    className="w-24 h-24 text-orange-500"
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
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900">
                    {match.user.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {match.user.age}歳 {match.user.location && `• ${match.user.location}`}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    マッチング: {formatDate(match.matchedAt)}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/messages/${match.user.id}`);
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg transition-colors"
                  >
                    💬 メッセージを送る
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
