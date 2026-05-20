import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const currentUserId = await getUserIdFromRequest(request);
    if (!currentUserId) return NextResponse.json({ error: "请先登录" }, { status: 401 });

    const { title, description, rewardSb, deadline } = await request.json();

    if (!title || !description || !rewardSb || rewardSb < 1) {
      return NextResponse.json({ error: "请填写完整信息，悬赏金额至少为1" }, { status: 400 });
    }

    const wallet = await prisma.wallet.findUnique({ where: { userId: currentUserId } });
    if (!wallet || wallet.balance < rewardSb) {
      return NextResponse.json({ error: "SB 余额不足" }, { status: 400 });
    }

    const task = await prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { userId: currentUserId },
        data: { balance: { decrement: rewardSb } },
      });

      await tx.transaction.create({
        data: {
          fromUserId: currentUserId,
          toUserId: currentUserId,
          amount: rewardSb,
          type: "task_lock",
        },
      });

      return tx.task.create({
        data: {
          publisherId: currentUserId,
          title,
          description,
          rewardSb,
          deadline: deadline ? new Date(deadline) : null,
        },
      });
    });

    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "open";
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = 20;

  const where = status === "all" ? {} : { status };
  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { publisher: { select: { id: true, username: true } } },
    }),
    prisma.task.count({ where }),
  ]);

  return NextResponse.json({ tasks, total, page, pageSize });
}
