"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Loading } from "@/components/Loading";
import { AdminStats } from "@/types";

export default function AdminPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") {
      router.push("/");
      return;
    }

    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, [session, router]);

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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">管理画面</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-gray-600 text-sm mb-1">総ユーザー数</div>
            <div className="text-3xl font-bold text-orange-500">
              {stats?.totalUsers || 0}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-gray-600 text-sm mb-1">アクティブユーザー</div>
            <div className="text-3xl font-bold text-green-500">
              {stats?.activeUsers || 0}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-gray-600 text-sm mb-1">総マッチング数</div>
            <div className="text-3xl font-bold text-pink-500">
              {stats?.totalMatches || 0}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-gray-600 text-sm mb-1">総メッセージ数</div>
            <div className="text-3xl font-bold text-blue-500">
              {stats?.totalMessages || 0}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">管理メニュー</h2>
          <div className="space-y-2">
            <button
              onClick={() => router.push("/admin/users")}
              className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              👥 ユーザー管理
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
