import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const currentUser = await requireAuth();

    await prisma.message.updateMany({
      where: {
        senderId: params.userId,
        receiverId: currentUser.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "既読更新に失敗しました" },
      { status: 500 }
    );
  }
}
