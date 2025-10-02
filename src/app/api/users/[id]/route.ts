import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        images: true,
        interests: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "ユーザー情報の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await requireAuth();

    if (currentUser.id !== params.id && currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "権限がありません" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, age, gender, location, bio, interests } = body;

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        name,
        age: age ? parseInt(age) : null,
        gender,
        location,
        bio,
        profileComplete: true,
        interests: interests
          ? {
              deleteMany: {},
              create: interests.map((name: string) => ({ name })),
            }
          : undefined,
      },
      include: {
        images: true,
        interests: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "ユーザー情報の更新に失敗しました" },
      { status: 500 }
    );
  }
}
