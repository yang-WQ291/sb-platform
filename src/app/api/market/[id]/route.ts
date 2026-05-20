import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";
import { getUserRating } from "@/lib/market";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: { select: { id: true, username: true } },
        _count: { select: { favorites: true } },
      },
    });
    if (!product) return NextResponse.json({ error: "商品不存在" }, { status: 404 });
    const rating = await getUserRating(product.sellerId);
    return NextResponse.json({ ...product, sellerRating: rating });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUserId = await getUserIdFromRequest(req);
    if (!currentUserId) return NextResponse.json({ error: "请先登录" }, { status: 401 });
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product || product.sellerId !== currentUserId) {
      return NextResponse.json({ error: "无权操作" }, { status: 403 });
    }
    const body = await req.json();
    const product2 = await prisma.product.update({ where: { id }, data: body });
    return NextResponse.json(product2);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
