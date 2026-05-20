import React from "react";
import { View, Text } from "react-native";

interface Comment {
  id: string; content: string; createdAt: string;
  author: { username: string }; replies?: Comment[];
}

export function CommentTree({ comments }: { comments: Comment[] }) {
  return (
    <View className="gap-3">
      {comments.map((c) => (
        <View key={c.id}>
          <View className="bg-stone-50 rounded-xl p-3">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-xs font-semibold text-stone-600">@{c.author.username}</Text>
              <Text className="text-xs text-stone-300">
                {new Date(c.createdAt).toLocaleDateString("zh-CN")}
              </Text>
            </View>
            <Text className="text-sm text-stone-700">{c.content}</Text>
          </View>
          {c.replies && c.replies.length > 0 && (
            <View className="ml-6 mt-2">
              <CommentTree comments={c.replies} />
            </View>
          )}
        </View>
      ))}
    </View>
  );
}
