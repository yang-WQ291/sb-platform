import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import { createReview } from "@/lib/market";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUserId = await getUserIdFromRequest(req);
    if (!currentUserId) return NextResponse.json({ error: "请先登录" }, { status: 401 });
    const { id } = await params;
    const { rating, comment, toId } = await req.json();
    if (!rating || !toId) return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    const review = await createReview(currentUserId, toId, id, parseInt(rating), comment || "");
    return NextResponse.json(review, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
