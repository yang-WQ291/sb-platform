import { getCurrentUser } from "@/lib/auth";
import { getWallet, getTransactions, TX_TYPE_LABELS } from "@/lib/wallet";
import { SBBadge } from "@/components/shared/SBBadge";
import { redirect } from "next/navigation";
import { TransferForm } from "./TransferForm";

export default async function WalletPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const wallet = await getWallet(user.id);
  const { transactions } = await getTransactions(user.id, 1, 20);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">我的钱包</h1>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <p className="text-sm text-gray-500 mb-1">当前余额</p>
        <p className="text-3xl font-bold">
          <SBBadge balance={wallet?.balance ?? 0} />
        </p>
      </div>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">转账</h2>
        <TransferForm />
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-4">交易记录</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-400 text-sm">暂无交易记录</p>
        ) : (
          <ul className="divide-y">
            {transactions.map((tx) => (
              <li key={tx.id} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium">{TX_TYPE_LABELS[tx.type] || tx.type}</span>
                  <span className="text-gray-400 ml-2">
                    {tx.fromUser.username} → {tx.toUser.username}
                  </span>
                </div>
                <span className={tx.toUserId === user.id ? "text-green-600" : "text-red-500"}>
                  {tx.toUserId === user.id ? "+" : "-"}{tx.amount} SB
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
