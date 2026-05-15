import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  if (!username || !password || password.length < 4) {
    return NextResponse.json({ error: "用户名不能为空，密码至少4位" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return NextResponse.json({ error: "用户名已存在" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      username,
      passwordHash,
      wallet: { create: { balance: 0 } },
    },
  });

  const session = await getSession();
  session.userId = user.id;
  await session.save();

  return NextResponse.json({ id: user.id, username: user.username });
}
