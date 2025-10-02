"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/Card";
import { Loading } from "@/components/Loading";
import { User } from "@/types";

export default function DiscoverPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minAge: "",
    maxAge: "",
    location: "",
    interest: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.minAge) params.append("minAge", filters.minAge);
      if (filters.maxAge) params.append("maxAge", filters.maxAge);
      if (filters.location) params.append("location", filters.location);
      if (filters.interest) params.append("interest", filters.interest);

      const response = await fetch(`/api/users?${params}`);
      const data = await response.json();
      setUsers(data.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (userId: string) => {
    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: userId }),
      });

      const data = await response.json();
      if (data.isMatched) {
        alert("マッチングしました！ 🎉");
      }
      
      setUsers(users.filter((u) => u.id !== userId));
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:ml-64">
      <Navigation />
      <div className="p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">ユーザーを探す</h1>

        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <input
              type="number"
              placeholder="最小年齢"
              value={filters.minAge}
              onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="number"
              placeholder="最大年齢"
              value={filters.maxAge}
              onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="text"
              placeholder="場所"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="text"
              placeholder="興味"
              value={filters.interest}
              onChange={(e) => setFilters({ ...filters, interest: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <button
            onClick={fetchUsers}
            className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg transition-colors"
          >
            検索
          </button>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">ユーザーが見つかりませんでした</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <Card
                key={user.id}
                user={user}
                onClick={() => router.push(`/users/${user.id}`)}
                onLike={() => handleLike(user.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
