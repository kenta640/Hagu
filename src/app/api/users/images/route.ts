import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "URLが必要です" },
        { status: 400 }
      );
    }

    const image = await prisma.image.create({
      data: {
        url,
        userId: currentUser.id,
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    return NextResponse.json(
      { error: "画像の追加に失敗しました" },
      { status: 500 }
    );
  }
}
