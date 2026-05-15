import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

    const { id } = await params;
    const { message } = await request.json();

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return NextResponse.json({ error: "任务不存在" }, { status: 404 });
    if (task.status !== "open") return NextResponse.json({ error: "任务已不可申请" }, { status: 400 });
    if (task.publisherId === user.id) return NextResponse.json({ error: "不能申请自己发布的任务" }, { status: 400 });

    const existing = await prisma.taskApplication.findUnique({
      where: { taskId_applicantId: { taskId: id, applicantId: user.id } },
    });
    if (existing) return NextResponse.json({ error: "你已经申请过了" }, { status: 400 });

    const application = await prisma.taskApplication.create({
      data: { taskId: id, applicantId: user.id, message: message || "" },
    });

    return NextResponse.json(application);
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
