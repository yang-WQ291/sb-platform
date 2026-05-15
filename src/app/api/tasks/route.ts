import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

    const { title, description, rewardSb, deadline } = await request.json();

    if (!title || !description || !rewardSb || rewardSb < 1) {
      return NextResponse.json({ error: "请填写完整信息，悬赏金额至少为1" }, { status: 400 });
    }

    if (user.wallet!.balance < rewardSb) {
      return NextResponse.json({ error: "SB 余额不足" }, { status: 400 });
    }

    const task = await prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { userId: user.id },
        data: { balance: { decrement: rewardSb } },
      });

      await tx.transaction.create({
        data: {
          fromUserId: user.id,
          toUserId: user.id,
          amount: rewardSb,
          type: "task_lock",
        },
      });

      return tx.task.create({
        data: {
          publisherId: user.id,
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
