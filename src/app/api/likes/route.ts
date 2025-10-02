import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    const body = await request.json();
    const { receiverId } = body;

    if (!receiverId) {
      return NextResponse.json(
        { error: "受信者IDが必要です" },
        { status: 400 }
      );
    }

    if (currentUser.id === receiverId) {
      return NextResponse.json(
        { error: "自分自身にはいいねできません" },
        { status: 400 }
      );
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        senderId_receiverId: {
          senderId: currentUser.id,
          receiverId,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json(
        { error: "既にいいね済みです" },
        { status: 400 }
      );
    }

    const reverseLike = await prisma.like.findUnique({
      where: {
        senderId_receiverId: {
          senderId: receiverId,
          receiverId: currentUser.id,
        },
      },
    });

    const isMatched = !!reverseLike;

    const like = await prisma.like.create({
      data: {
        senderId: currentUser.id,
        receiverId,
        isMatched,
      },
    });

    if (isMatched && reverseLike) {
      await prisma.like.update({
        where: { id: reverseLike.id },
        data: { isMatched: true },
      });
    }

    return NextResponse.json({ ...like, isMatched });
  } catch (error) {
    return NextResponse.json(
      { error: "いいねの送信に失敗しました" },
      { status: 500 }
    );
  }
}
