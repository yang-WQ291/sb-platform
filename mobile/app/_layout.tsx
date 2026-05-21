import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getToken } from "../lib/auth";

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    getToken()
      .then((token) => {
        setIsAuthed(!!token);
        setIsReady(true);
      })
      .catch(() => {
        // SecureStore may throw if not available (e.g. on some Android emulators)
        setIsAuthed(false);
        setIsReady(true);
      });
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const isAuthPage = segments[0] === "login" || segments[0] === "register";
    const inAuthGroup = segments[0] === "(tabs)";

    if (!isAuthed && !isAuthPage) {
      router.replace("/login");
    } else if (isAuthed && isAuthPage) {
      router.replace("/(tabs)");
    }
  }, [isReady, isAuthed, segments]);

  if (!isReady) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="flex-1 items-center justify-center bg-warm-cream">
          <ActivityIndicator size="large" color="#f59e0b" />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" options={{ title: "登录", headerShown: true }} />
        <Stack.Screen name="register" options={{ title: "注册", headerShown: true }} />
        <Stack.Screen name="market/[id]" options={{ title: "商品详情", headerShown: true }} />
        <Stack.Screen name="market/create" options={{ title: "发布商品", headerShown: true }} />
        <Stack.Screen name="market/my" options={{ title: "我的交易", headerShown: true }} />
        <Stack.Screen name="market/messages/[userId]" options={{ title: "私信", headerShown: true }} />
        <Stack.Screen name="tasks/[id]" options={{ title: "任务详情", headerShown: true }} />
        <Stack.Screen name="tasks/create" options={{ title: "发布任务", headerShown: true }} />
        <Stack.Screen name="forum/[boardId]" options={{ title: "板块", headerShown: true }} />
        <Stack.Screen name="forum/[boardId]/[postId]" options={{ title: "帖子", headerShown: true }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
