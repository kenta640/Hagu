"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) return null;

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { path: "/", label: "ホーム", icon: "🏠" },
    { path: "/discover", label: "さがす", icon: "🔍" },
    { path: "/matches", label: "マッチ", icon: "💕" },
    { path: "/messages", label: "メッセージ", icon: "💬" },
    { path: "/profile/edit", label: "プロフィール", icon: "👤" },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center px-3 py-2 text-xs ${
                isActive(item.path)
                  ? "text-orange-500"
                  : "text-gray-600 hover:text-orange-400"
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <aside className="hidden md:flex md:flex-col md:fixed md:left-0 md:top-0 md:h-full md:w-64 md:bg-white md:border-r md:border-gray-200 md:p-6">
        <h1 className="text-2xl font-bold text-orange-500 mb-8">Hagu</h1>
        <nav className="flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
                isActive(item.path)
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
          {session.user.role === "ADMIN" && (
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
                pathname.startsWith("/admin")
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-2xl">⚙️</span>
              <span className="font-medium">管理画面</span>
            </Link>
          )}
        </nav>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          <span className="text-2xl">🚪</span>
          <span className="font-medium">ログアウト</span>
        </button>
      </aside>
    </>
  );
}
