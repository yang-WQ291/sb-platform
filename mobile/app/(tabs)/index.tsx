import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { HeroBanner } from "../../components/ui/HeroBanner";
import { Card } from "../../components/ui/Card";
import { ProductCard } from "../../components/market/ProductCard";
import { TaskCard } from "../../components/tasks/TaskCard";
import { EmptyState } from "../../components/ui/EmptyState";
import api from "../../lib/api";
import { getCurrentUser } from "../../lib/auth";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);
    try {
      const [userData, tasksData, productsData] = await Promise.all([
        getCurrentUser(),
        api.get<any[]>("/api/tasks?limit=3"),
        api.get<any>("/api/market?pageSize=3"),
      ]);
      setUser(userData);
      setTasks(Array.isArray(tasksData) ? tasksData.slice(0, 3) : []);
      setProducts(productsData.products || []);
    } catch (err) {
      console.error("Home fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-warm-cream">
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  const stats = [
    { label: "💰 余额", value: user?.wallet?.balance ?? 0 },
    { label: "📦 在售", value: 0 },
    { label: "⭐ 评价", value: user?.rating ?? "-" },
  ];

  const zoneEntries = [
    { emoji: "🎯", label: "悬赏", href: "/(tabs)/tasks" },
    { emoji: "💬", label: "八卦", href: "/(tabs)/forum" },
    { emoji: "🛒", label: "二手", href: "/(tabs)/market" },
    { emoji: "👤", label: "我的", href: "/(tabs)/profile" },
  ];

  return (
    <ScrollView
      className="flex-1 bg-warm-cream"
      contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={false} onRefresh={fetchData} />}
    >
      <HeroBanner stats={stats} />

      {/* Zone entry cards */}
      <View className="flex-row gap-3 mb-5">
        {zoneEntries.map((item) => (
          <Link key={item.label} href={item.href as any} asChild>
            <Card className="flex-1 items-center py-3">
              <Text className="text-2xl mb-1">{item.emoji}</Text>
              <Text className="text-xs font-semibold text-stone-600">{item.label}</Text>
            </Card>
          </Link>
        ))}
      </View>

      {/* Latest tasks */}
      <Text className="text-sm font-bold text-amber-800 mb-2">🔶 最新悬赏</Text>
      {tasks.length > 0 ? tasks.map((t: any) => <TaskCard key={t.id} task={t} />) : <EmptyState title="暂无悬赏" />}

      {/* Latest products */}
      <Text className="text-sm font-bold text-emerald-800 mb-2 mt-4">🟢 最新二手</Text>
      {products.length > 0 ? products.map((p: any) => <ProductCard key={p.id} product={p} />) : <EmptyState title="暂无商品" />}

      <View className="h-20" />
    </ScrollView>
  );
}
