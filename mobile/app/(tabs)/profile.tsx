import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator } from "react-native";
import { useRouter, Link } from "expo-router";
import { Card } from "../../components/ui/Card";
import { Avatar } from "../../components/ui/Avatar";
import { ReviewStarsDisplay } from "../../components/market/ReviewStars";
import { LinearGradient } from "expo-linear-gradient";
import { getCurrentUser, logout } from "../../lib/auth";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then((u) => { setUser(u); setLoading(false); });
  }, []);

  async function handleLogout() {
    Alert.alert("退出登录", "确定要退出吗？", [
      { text: "取消", style: "cancel" },
      { text: "退出", style: "destructive", onPress: async () => {
        await logout();
        router.replace("/login");
      }},
    ]);
  }

  if (loading) return <ActivityIndicator size="large" color="#f59e0b" className="flex-1 mt-20" />;
  if (!user) return <View />;

  const links = [
    { emoji: "🛒", label: "我的交易", href: "/market/my" },
    { emoji: "🎯", label: "发布悬赏", href: "/tasks/create" },
    { emoji: "📦", label: "发布商品", href: "/market/create" },
  ];

  return (
    <ScrollView className="flex-1 bg-warm-cream" contentContainerStyle={{ padding: 16 }}>
      <Card className="mb-4 items-center py-6">
        <Avatar username={user.username} size={64} />
        <Text className="text-lg font-bold text-stone-800 mt-3">@{user.username}</Text>
        {user.rating && <ReviewStarsDisplay rating={user.rating} />}
      </Card>

      <Card className="mb-4">
        <Text className="text-sm font-semibold text-stone-600 mb-1">💰 我的余额</Text>
        <Text className="text-2xl font-bold text-amber-500">{user.wallet?.balance ?? 0} SB</Text>
      </Card>

      <Text className="text-sm font-bold text-stone-600 mb-2">快捷入口</Text>
      {links.map((item) => (
        <Link key={item.label} href={item.href as any} asChild>
          <Card className="mb-2">
            <View className="flex-row items-center gap-3">
              <Text className="text-xl">{item.emoji}</Text>
              <Text className="text-sm font-medium text-stone-700">{item.label}</Text>
            </View>
          </Card>
        </Link>
      ))}

      <LinearGradient colors={["#ef4444", "#dc2626"]} className="rounded-xl overflow-hidden mt-4">
        <Pressable className="h-12 items-center justify-center" onPress={handleLogout}>
          <Text className="text-white font-bold">退出登录</Text>
        </Pressable>
      </LinearGradient>
    </ScrollView>
  );
}
