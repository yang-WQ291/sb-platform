import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

    const { boardId } = await params;
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: "标题和内容不能为空" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: { boardId, authorId: user.id, title, content },
    });

    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
