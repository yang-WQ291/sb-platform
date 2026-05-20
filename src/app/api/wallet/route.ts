import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import { getWallet, getTransactions } from "@/lib/wallet";

export async function GET(request: NextRequest) {
  try {
    const currentUserId = await getUserIdFromRequest(request);
    if (!currentUserId) return NextResponse.json({ error: "请先登录" }, { status: 401 });

    const wallet = await getWallet(currentUserId);
    const { transactions } = await getTransactions(currentUserId);

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
