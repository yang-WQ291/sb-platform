import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getWallet, getTransactions } from "@/lib/wallet";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

    const wallet = await getWallet(user.id);
    const { transactions } = await getTransactions(user.id);

    return NextResponse.json({
      balance: wallet?.balance ?? 0,
      transactions: transactions.map((tx) => ({
        id: tx.id,
        type: tx.type,
        amount: tx.amount,
        from: tx.fromUser.username,
        to: tx.toUser.username,
        createdAt: tx.createdAt,
      })),
    });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
