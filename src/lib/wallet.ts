import { prisma } from "./prisma";

export async function getWallet(userId: string) {
  return prisma.wallet.findUnique({ where: { userId } });
}

export async function getTransactions(userId: string, page = 1, pageSize = 20) {
  const where = {
    OR: [{ fromUserId: userId }, { toUserId: userId }],
  };
  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        fromUser: { select: { id: true, username: true } },
        toUser: { select: { id: true, username: true } },
      },
    }),
    prisma.transaction.count({ where }),
  ]);
  return { transactions, total, page, pageSize };
}

export async function transferSb(fromUserId: string, toUsername: string, amount: number) {
  if (amount <= 0) throw new Error("转账金额必须大于0");

  await prisma.$transaction(async (tx) => {
    const fromWallet = await tx.wallet.findUnique({ where: { userId: fromUserId } });
    if (!fromWallet || fromWallet.balance < amount) throw new Error("余额不足");

    const toUser = await tx.user.findUnique({ where: { username: toUsername } });
    if (!toUser) throw new Error("目标用户不存在");
    if (toUser.id === fromUserId) throw new Error("不能给自己转账");

    await tx.wallet.update({ where: { userId: fromUserId }, data: { balance: { decrement: amount } } });
    await tx.wallet.update({ where: { userId: toUser.id }, data: { balance: { increment: amount } } });

    await tx.transaction.create({
      data: {
        fromUserId,
        toUserId: toUser.id,
        amount,
        type: "transfer",
      },
    });
  });
}

export const TX_TYPE_LABELS: Record<string, string> = {
  task_lock: "悬赏冻结",
  task_reward: "悬赏收入",
  task_refund: "冻结退还",
  transfer: "转账",
};
