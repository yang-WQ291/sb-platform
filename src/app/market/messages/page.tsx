import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MessagesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const messages = await prisma.message.findMany({
    where: { OR: [{ fromId: user.id }, { toId: user.id }] },
    orderBy: { createdAt: "desc" },
    include: {
      fromUser: { select: { id: true, username: true } },
      toUser: { select: { id: true, username: true } },
      product: { select: { id: true, title: true } },
    },
  });

  const threads = new Map<string, (typeof messages)[0]>();
  for (const msg of messages) {
    const otherId = msg.fromId === user.id ? msg.toId : msg.fromId;
    if (!threads.has(otherId)) threads.set(otherId, msg);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-emerald-900 mb-6">私信</h1>
      {threads.size === 0 ? (
        <p className="text-stone-400 text-sm">暂无消息</p>
      ) : (
        <div className="space-y-2">
          {[...threads.values()].map((msg) => {
            const other = msg.fromId === user.id ? msg.toUser : msg.fromUser;
            return (
              <Link key={other.id} href={`/market/messages/${other.id}`}
                className="block bg-white rounded-lg px-4 py-3 hover:shadow transition-shadow"
                style={{ borderLeft: "4px solid #10b981" }}>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-stone-700">{other.username}</span>
                  <span className="text-xs text-stone-400">{new Date(msg.createdAt).toLocaleDateString("zh-CN")}</span>
                </div>
                <p className="text-sm text-stone-500 truncate mt-1">{msg.content}</p>
                <p className="text-xs text-stone-400 mt-0.5">商品: {msg.product.title}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
