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
      <Link href="/forum" className="text-sm text-gray-400 hover:text-gray-600 mb-2 inline-block">&larr; 返回版块列表</Link>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{board.name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{board.description}</p>
        </div>
      </div>

      {user && (
        <div className="mb-4">
          <CreatePostForm boardId={boardId} />
        </div>
      )}

      <div>
        {posts.length === 0 ? (
          <p className="text-gray-400 text-center py-12 text-sm">还没有帖子，来发第一个吧</p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} boardId={boardId} />)
        )}
      </div>
    </div>
  );
}
