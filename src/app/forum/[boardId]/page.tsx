import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { PostCard } from "@/components/forum/PostCard";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CreatePostForm } from "./CreatePostForm";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = await params;
  const user = await getCurrentUser();

  const board = await prisma.board.findUnique({ where: { id: boardId } });
  if (!board) notFound();

  const posts = await prisma.post.findMany({
    where: { boardId },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, username: true } },
      _count: { select: { comments: true } },
    },
  });

  return (
    <div>
      <Link href="/forum" className="text-sm text-gray-400 hover:underline mb-2 inline-block">&larr; 返回版块列表</Link>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{board.name}</h1>
          <p className="text-sm text-gray-500">{board.description}</p>
        </div>
      </div>

      {user && <CreatePostForm boardId={boardId} />}

      <div className="mt-4 grid gap-3">
        {posts.length === 0 ? (
          <p className="text-gray-400 text-center py-8">还没有帖子，来发第一个吧</p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} boardId={boardId} />)
        )}
      </div>
    </div>
  );
}
