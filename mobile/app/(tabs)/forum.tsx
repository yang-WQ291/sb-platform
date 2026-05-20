import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Card } from "../../components/ui/Card";
import { Link } from "expo-router";
import api from "../../lib/api";

export default function ForumTab() {
  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchBoards() {
    try {
      const data = await api.get<any>("/api/forum");
      setBoards(Array.isArray(data) ? data : data.boards || []);
    } catch (err) {
      console.error("Forum fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchBoards(); }, []);

  if (loading) return <ActivityIndicator size="large" color="#6366f1" className="flex-1 mt-20" />;

  return (
    <ScrollView className="flex-1 bg-warm-cream px-4 pt-4">
      <Text className="text-base font-bold text-indigo-800 mb-3">💬 八卦专区</Text>
      {boards.map((board: any) => (
        <Link key={board.id} href={`/forum/${board.id}`} asChild>
          <Card leftBorder="indigo" className="mb-3">
            <Text className="text-sm font-semibold text-stone-800">{board.name}</Text>
            <Text className="text-xs text-stone-400 mt-1">{board.description}</Text>
          </Card>
        </Link>
      ))}
      <View className="h-20" />
    </ScrollView>
  );
}
