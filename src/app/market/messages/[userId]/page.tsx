import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { MessageThread } from "@/components/market/MessageThread";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SendForm } from "./SendForm";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { userId } = await params;

  const otherUser = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, username: true } });
  if (!otherUser) return <p className="text-stone-400">用户不存在</p>;

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { fromId: user.id, toId: userId },
        { fromId: userId, toId: user.id },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/market/messages" className="text-sm text-emerald-600 hover:underline mb-4 inline-block">&larr; 返回</Link>
      <h1 className="text-xl font-bold text-stone-800 mb-4">{otherUser.username}</h1>
      <div className="bg-white rounded-xl p-4 mb-4" style={{ border: "1px solid #d1fae5", minHeight: 300 }}>
        <MessageThread
          messages={messages.map((m) => ({
            id: m.id,
            content: m.content,
            createdAt: m.createdAt.toISOString(),
            fromId: m.fromId,
          }))}
          currentUserId={user.id}
        />
      </div>
      <SendForm toId={userId} />
    </div>
  );
}
