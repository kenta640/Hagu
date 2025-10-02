import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    const body = await request.json();
    const { receiverId, content } = body;

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: "受信者IDとメッセージ内容が必要です" },
        { status: 400 }
      );
    }

    const match = await prisma.like.findFirst({
      where: {
        OR: [
          {
            senderId: currentUser.id,
            receiverId,
            isMatched: true,
          },
          {
            senderId: receiverId,
            receiverId: currentUser.id,
            isMatched: true,
          },
        ],
      },
    });

    if (!match) {
      return NextResponse.json(
        { error: "マッチングしていないユーザーです" },
        { status: 403 }
      );
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: currentUser.id,
        receiverId,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json(
      { error: "メッセージの送信に失敗しました" },
      { status: 500 }
    );
  }
}
