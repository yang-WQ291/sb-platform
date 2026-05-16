"use client";

import { useState } from "react";
import { CommentForm } from "./CommentForm";

interface CommentData {
  id: string;
  content: string;
  createdAt: Date;
  parentId: string | null;
  author: { id: string; username: string };
  replies?: CommentData[];
}

function CommentItem({ comment, postId, depth = 0 }: { comment: CommentData; postId: string; depth?: number }) {
  const [showReply, setShowReply] = useState(false);

  return (
    <div className={`${depth > 0 ? "ml-6 border-l-2 border-gray-100 pl-3" : ""}`}>
      <div className="py-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">@{comment.author.username}</span>
          <span className="text-gray-400 text-xs">
            {new Date(comment.createdAt).toLocaleString("zh-CN")}
          </span>
        </div>
        <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
        <button
          onClick={() => setShowReply(!showReply)}
          className="text-xs text-gray-400 hover:text-blue-500 mt-1"
        >
          {showReply ? "取消回复" : "回复"}
        </button>
        {showReply && (
          <div className="mt-2">
            <CommentForm
              postId={postId}
              parentId={comment.id}
              onSuccess={() => setShowReply(false)}
            />
          </div>
        )}
      </div>
      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} postId={postId} depth={depth + 1} />
      ))}
    </div>
  );
}

export function CommentTree({ comments, postId }: { comments: CommentData[]; postId: string }) {
  // Build tree: parent → children map
  const roots: CommentData[] = [];
  const map = new Map<string, CommentData>();

  comments.forEach((c) => {
    map.set(c.id, { ...c, replies: [] });
  });

  map.forEach((c) => {
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)!.replies!.push(c);
    } else {
      roots.push(c);
    }
  });

  return (
    <div className="divide-y">
      {roots.map((comment) => (
        <CommentItem key={comment.id} comment={comment} postId={postId} />
      ))}
    </div>
  );
}
