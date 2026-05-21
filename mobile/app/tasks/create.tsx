import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import api from "../../lib/api";

export default function CreateTaskPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!title.trim() || !reward) { Alert.alert("提示", "标题和赏金必填"); return; }
    setLoading(true);
    try {
      await api.post("/api/tasks", { title: title.trim(), description, rewardSb: parseInt(reward) });
      Alert.alert("发布成功", "悬赏已发布", [{ text: "好的", onPress: () => router.back() }]);
    } catch (err: any) {
      Alert.alert("发布失败", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-warm-cream" contentContainerStyle={{ padding: 16 }}>
      <Text className="text-sm font-semibold text-stone-600 mb-1">标题 *</Text>
      <TextInput className="bg-white border border-stone-200 rounded-xl px-4 h-12 mb-4 text-stone-800" placeholder="悬赏标题" placeholderTextColor="#a8a29e" value={title} onChangeText={setTitle} />
      <Text className="text-sm font-semibold text-stone-600 mb-1">赏金 (SB) *</Text>
      <TextInput className="bg-white border border-stone-200 rounded-xl px-4 h-12 mb-4 text-stone-800" placeholder="输入赏金" placeholderTextColor="#a8a29e" keyboardType="numeric" value={reward} onChangeText={setReward} />
      <Text className="text-sm font-semibold text-stone-600 mb-1">描述</Text>
      <TextInput className="bg-white border border-stone-200 rounded-xl p-3 min-h-[120px] mb-6 text-stone-800" placeholder="描述任务详情..." placeholderTextColor="#a8a29e" value={description} onChangeText={setDescription} multiline />
      <LinearGradient colors={["#f59e0b", "#d97706"]} className="rounded-xl overflow-hidden">
        <Pressable className="h-12 items-center justify-center" onPress={handleCreate} disabled={loading}>
          <Text className="text-white font-bold text-base">{loading ? "发布中..." : "发布悬赏"}</Text>
        </Pressable>
      </LinearGradient>
    </ScrollView>
  );
}
