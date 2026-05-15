import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await getSession();
    session.destroy();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
