import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

    const { postId } = await params;
    const { content, parentId } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "评论不能为空" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        authorId: user.id,
        content,
        parentId: parentId || null,
      },
      include: { author: { select: { id: true, username: true } } },
    });

    return NextResponse.json(comment);
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
