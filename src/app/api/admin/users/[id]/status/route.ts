import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { role } = body;

    const user = await prisma.user.update({
      where: { id: params.id },
      data: { role },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "ユーザーステータスの更新に失敗しました" },
      { status: 500 }
    );
  }
}
