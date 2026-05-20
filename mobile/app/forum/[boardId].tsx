import React, { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { PostCard } from "../../components/forum/PostCard";
import { EmptyState } from "../../components/ui/EmptyState";
import api from "../../lib/api";

export default function BoardPage() {
  const { boardId } = useLocalSearchParams<{ boardId: string }>();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<any>(`/api/forum/${boardId}/posts`).then((data) => {
      setPosts(Array.isArray(data) ? data : data.posts || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [boardId]);

  if (loading) return <ActivityIndicator size="large" color="#6366f1" className="flex-1 mt-20" />;

  return (
    <ScrollView className="flex-1 bg-warm-cream px-4 pt-4">
      {posts.length > 0 ? posts.map((p: any) => <PostCard key={p.id} post={p} />) : <EmptyState title="暂无帖子" />}
      <View className="h-20" />
    </ScrollView>
  );
}
