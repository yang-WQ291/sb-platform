import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUserId = await getUserIdFromRequest(request);
    if (!currentUserId) return NextResponse.json({ error: "请先登录" }, { status: 401 });

    const { id } = await params;
    const { action } = await request.json();

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return NextResponse.json({ error: "任务不存在" }, { status: 404 });

    if (action === "complete" && task.publisherId === currentUserId && task.status === "in_progress") {
      const updated = await prisma.$transaction(async (tx) => {
        await tx.task.update({ where: { id }, data: { status: "completed" } });

        await tx.wallet.update({
          where: { userId: task.assignedUserId! },
          data: { balance: { increment: task.rewardSb } },
        });

        await tx.transaction.create({
          data: {
            fromUserId: task.publisherId,
            toUserId: task.assignedUserId!,
            amount: task.rewardSb,
            type: "task_reward",
            taskId: id,
          },
        });

        return tx.task.findUnique({ where: { id } });
      });
      return NextResponse.json(updated);
    }

    if (action === "cancel" && task.publisherId === currentUserId && task.status === "open") {
      const updated = await prisma.$transaction(async (tx) => {
        await tx.task.update({ where: { id }, data: { status: "cancelled" } });

        await tx.wallet.update({
          where: { userId: currentUserId },
          data: { balance: { increment: task.rewardSb } },
        });

        await tx.transaction.create({
          data: {
            fromUserId: currentUserId,
            toUserId: currentUserId,
            amount: task.rewardSb,
            type: "task_refund",
            taskId: id,
          },
        });

        return tx.task.findUnique({ where: { id } });
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "无权执行此操作" }, { status: 403 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "服务器错误" }, { status: 400 });
  }
}
