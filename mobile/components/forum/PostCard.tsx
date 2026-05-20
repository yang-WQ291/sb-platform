import React from "react";
import { View, Text } from "react-native";
import { Link } from "expo-router";
import { Card } from "../ui/Card";

interface PostCardProps {
  post: {
    id: string; boardId: string; title: string; createdAt: string;
    author: { username: string }; _count?: { comments: number };
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/forum/${post.boardId}/${post.id}`} asChild>
      <Card leftBorder="indigo" className="mb-3">
        <Text className="text-sm font-semibold text-stone-800 mb-2" numberOfLines={2}>
          {post.title}
        </Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-stone-400">@{post.author.username}</Text>
          <View className="flex-row gap-3">
            <Text className="text-xs text-stone-300">
              {new Date(post.createdAt).toLocaleDateString("zh-CN")}
            </Text>
            {post._count && <Text className="text-xs text-stone-300">💬 {post._count.comments}</Text>}
          </View>
        </View>
      </Card>
    </Link>
  );
}
