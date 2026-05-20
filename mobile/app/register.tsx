import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { login } from "../lib/auth";
import api from "../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!username.trim() || password.length < 4) {
      Alert.alert("提示", "用户名不能为空，密码至少4位");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/auth/register", { username: username.trim(), password });
      await login(username.trim(), password);
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("注册失败", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-warm-cream justify-center px-8">
      <Text className="text-2xl font-bold text-stone-800 mb-6">注册</Text>

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
        placeholder="密码（至少4位）"
        placeholderTextColor="#a8a29e"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <LinearGradient colors={["#f59e0b", "#d97706"]} className="rounded-xl overflow-hidden">
        <Pressable
          className="h-12 items-center justify-center"
          onPress={handleRegister}
          disabled={loading}
        >
          <Text className="text-white font-bold text-base">
            {loading ? "注册中..." : "注册"}
          </Text>
        </Pressable>
      </LinearGradient>

      <Pressable onPress={() => router.back()} className="mt-4 items-center">
        <Text className="text-stone-400 text-sm">已有账号？<Text className="text-amber-500">返回登录</Text></Text>
      </Pressable>
    </View>
  );
}
