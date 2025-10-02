"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/discover");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-orange-500 mb-4">Hagu</h1>
          <p className="text-2xl text-gray-700 mb-2">新しい出会いを見つけよう</p>
          <p className="text-gray-600">素敵なマッチングがあなたを待っています</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">💝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ようこそ
            </h2>
            <p className="text-gray-600">
              ログインして素敵な出会いを見つけましょう
            </p>
          </div>

          <Link
            href="/login"
            className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg text-center transition-colors"
          >
            ログイン
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>© 2025 Hagu. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
