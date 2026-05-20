import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { login } from "../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!username.trim() || !password) {
      Alert.alert("提示", "请输入用户名和密码");
      return;
    }
    setLoading(true);
    try {
      await login(username.trim(), password);
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("登录失败", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-warm-cream justify-center px-8">
      <LinearGradient colors={["#f59e0b", "#ea580c"]} className="rounded-2xl p-8 mb-8 items-center">
        <Text className="text-white text-2xl font-bold mb-1">SB 社区</Text>
        <Text className="text-white/80 text-sm">悬赏互助 · 二手闲置</Text>
      </LinearGradient>

      <Text className="text-2xl font-bold text-stone-800 mb-6">登录</Text>

      <TextInput
        className="bg-white border border-stone-200 rounded-xl px-4 h-12 mb-3 text-stone-800"
        placeholder="用户名"
        placeholderTextColor="#a8a29e"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        className="bg-white border border-stone-200 rounded-xl px-4 h-12 mb-6 text-stone-800"
        placeholder="密码"
        placeholderTextColor="#a8a29e"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <LinearGradient colors={["#f59e0b", "#d97706"]} className="rounded-xl overflow-hidden">
        <Pressable
          className="h-12 items-center justify-center"
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-white font-bold text-base">
            {loading ? "登录中..." : "登录"}
          </Text>
        </Pressable>
      </LinearGradient>

      <Pressable onPress={() => router.push("/register")} className="mt-4 items-center">
        <Text className="text-stone-400 text-sm">没有账号？<Text className="text-amber-500">立即注册</Text></Text>
      </Pressable>
    </View>
  );
}
