import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import { transferSb } from "@/lib/wallet";

export async function POST(request: NextRequest) {
  try {
    const currentUserId = await getUserIdFromRequest(request);
    if (!currentUserId) return NextResponse.json({ error: "请先登录" }, { status: 401 });

    const { toUsername, amount } = await request.json();
    await transferSb(currentUserId, toUsername, parseInt(amount));
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
