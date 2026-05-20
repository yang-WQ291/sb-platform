import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const currentUserId = await getUserIdFromRequest(req);
    if (!currentUserId) return NextResponse.json({ error: "请先登录" }, { status: 401 });
    const messages = await prisma.message.findMany({
      where: { OR: [{ fromId: currentUserId }, { toId: currentUserId }] },
      orderBy: { createdAt: "desc" },
      include: {
        fromUser: { select: { id: true, username: true } },
        toUser: { select: { id: true, username: true } },
        product: { select: { id: true, title: true } },
      },
    });
    return NextResponse.json(messages);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUserId = await getUserIdFromRequest(req);
    if (!currentUserId) return NextResponse.json({ error: "请先登录" }, { status: 401 });
    const { toId, productId, content } = await req.json();
    if (!toId || !productId || !content) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }
    const message = await prisma.message.create({
      data: { fromId: currentUserId, toId, productId, content },
    });
    return NextResponse.json(message, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
