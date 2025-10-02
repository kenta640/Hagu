import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const currentUser = await requireAuth();

    const likes = await prisma.like.findMany({
      where: { senderId: currentUser.id },
      include: {
        receiver: {
          include: {
            images: { take: 1 },
            interests: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(likes);
  } catch (error) {
    return NextResponse.json(
      { error: "送信したいいねの取得に失敗しました" },
      { status: 500 }
    );
  }
}
