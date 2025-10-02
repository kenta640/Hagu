import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const currentUser = await requireAuth();

    const matches = await prisma.like.findMany({
      where: {
        OR: [
          { senderId: currentUser.id, isMatched: true },
          { receiverId: currentUser.id, isMatched: true },
        ],
      },
      include: {
        sender: {
          include: {
            images: { take: 1 },
            interests: true,
          },
        },
        receiver: {
          include: {
            images: { take: 1 },
            interests: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const matchedUsers = matches.map((match) => {
      const matchedUser =
        match.senderId === currentUser.id ? match.receiver : match.sender;
      return {
        user: matchedUser,
        matchedAt: match.createdAt,
      };
    });

    const uniqueMatches = matchedUsers.filter(
      (match, index, self) =>
        index === self.findIndex((m) => m.user.id === match.user.id)
    );

    return NextResponse.json(uniqueMatches);
  } catch (error) {
    return NextResponse.json(
      { error: "マッチング一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}
