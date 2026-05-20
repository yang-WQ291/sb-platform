import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Card } from "../../../components/ui/Card";
import { CommentTree } from "../../../components/forum/CommentTree";
import api from "../../../lib/api";

export default function PostDetailPage() {
  const { boardId, postId } = useLocalSearchParams<{ boardId: string; postId: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<any>(`/api/forum/posts/${postId}`).then((data: any) => {
      setPost(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [postId]);

  if (loading) return <ActivityIndicator size="large" color="#6366f1" className="flex-1 mt-20" />;
  if (!post) return <View />;

  return (
    <ScrollView className="flex-1 bg-warm-cream" contentContainerStyle={{ padding: 16 }}>
      <Card leftBorder="indigo" className="mb-4">
        <Text className="text-lg font-bold text-stone-800 mb-2">{post.title}</Text>
        <Text className="text-sm text-stone-500 mb-3">{post.content}</Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-stone-400">@{post.author?.username}</Text>
          <Text className="text-xs text-stone-300">{new Date(post.createdAt).toLocaleDateString("zh-CN")}</Text>
        </View>
      </Card>
      <Text className="text-sm font-semibold text-stone-600 mb-3">评论 ({post.comments?.length || 0})</Text>
      {post.comments && <CommentTree comments={post.comments} />}
      <View className="h-20" />
    </ScrollView>
  );
}
