import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";
import { getProducts } from "@/lib/market";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const data = await getProducts({ category, search, page });
    return NextResponse.json(data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUserId = await getUserIdFromRequest(req);
    if (!currentUserId) return NextResponse.json({ error: "请先登录" }, { status: 401 });
    const body = await req.json();
    const { title, description, price, category, images } = body;
    if (!title || !description || !price) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }
    const product = await prisma.product.create({
      data: {
        sellerId: currentUserId,
        title,
        description,
        price: parseInt(price),
        category: category || "其他",
        images: JSON.stringify(images || []),
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
