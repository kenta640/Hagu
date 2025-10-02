import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const currentUser = await requireAuth();

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUser.id },
          { receiverId: currentUser.id },
        ],
      },
      include: {
        sender: {
          include: {
            images: { take: 1 },
          },
        },
        receiver: {
          include: {
            images: { take: 1 },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const conversationMap = new Map();

    messages.forEach((message) => {
      const otherUserId =
        message.senderId === currentUser.id
          ? message.receiverId
          : message.senderId;

      if (!conversationMap.has(otherUserId)) {
        const otherUser =
          message.senderId === currentUser.id
            ? message.receiver
            : message.sender;

        const unreadCount = messages.filter(
          (m) =>
            m.senderId === otherUserId &&
            m.receiverId === currentUser.id &&
            !m.isRead
        ).length;

        conversationMap.set(otherUserId, {
          userId: otherUserId,
          user: otherUser,
          lastMessage: message,
          unreadCount,
        });
      }
    });

    return NextResponse.json(Array.from(conversationMap.values()));
  } catch (error) {
    return NextResponse.json(
      { error: "会話一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}
