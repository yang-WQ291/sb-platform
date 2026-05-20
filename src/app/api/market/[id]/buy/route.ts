import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import { buyProduct } from "@/lib/market";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUserId = await getUserIdFromRequest(req);
    if (!currentUserId) return NextResponse.json({ error: "请先登录" }, { status: 401 });
    const { id } = await params;
    await buyProduct(currentUserId, id);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
