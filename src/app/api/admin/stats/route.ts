import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const [totalUsers, totalMatches, totalMessages] = await Promise.all([
      prisma.user.count(),
      prisma.like.count({ where: { isMatched: true } }),
      prisma.message.count(),
    ]);

    const activeUsers = await prisma.user.count({
      where: {
        updatedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    return NextResponse.json({
      totalUsers,
      activeUsers,
      totalMatches: Math.floor(totalMatches / 2),
      totalMessages,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "統計情報の取得に失敗しました" },
      { status: 500 }
    );
  }
}
