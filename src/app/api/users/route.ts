import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const minAge = searchParams.get("minAge");
    const maxAge = searchParams.get("maxAge");
    const location = searchParams.get("location");
    const interest = searchParams.get("interest");

    const where: {
      profileComplete: boolean;
      age?: { gte?: number; lte?: number };
      location?: { contains: string };
      interests?: { some: { name: { contains: string } } };
    } = {
      profileComplete: true,
    };

    if (minAge) {
      where.age = { ...where.age, gte: parseInt(minAge) };
    }
    if (maxAge) {
      where.age = { ...where.age, lte: parseInt(maxAge) };
    }
    if (location) {
      where.location = { contains: location };
    }
    if (interest) {
      where.interests = {
        some: { name: { contains: interest } },
      };
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          images: { take: 1 },
          interests: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      data: users,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "ユーザー一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}
