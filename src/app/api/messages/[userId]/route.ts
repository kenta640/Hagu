import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const currentUser = await requireAuth();

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUser.id, receiverId: params.userId },
          { senderId: params.userId, receiverId: currentUser.id },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            images: { take: 1 },
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            images: { take: 1 },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      { error: "メッセージの取得に失敗しました" },
      { status: 500 }
    );
  }
}
