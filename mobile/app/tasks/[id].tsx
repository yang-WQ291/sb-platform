import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Card } from "../../components/ui/Card";
import { TaskStatusBadge } from "../../components/tasks/TaskStatusBadge";
import { LinearGradient } from "expo-linear-gradient";
import api from "../../lib/api";
import { getCurrentUser } from "../../lib/auth";

export default function TaskDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  async function fetchTask() {
    try {
      const data = await api.get<any>(`/api/tasks/${id}`);
      setTask(data);
    } catch (err) {
      Alert.alert("错误", "任务不存在");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchTask(); getCurrentUser().then(setCurrentUser); }, [id]);

  async function handleApply() {
    try {
      await api.post(`/api/tasks/${id}/apply`);
      Alert.alert("申请成功", "等待发布者确认");
      fetchTask();
    } catch (err: any) {
      Alert.alert("申请失败", err.message);
    }
  }

  if (loading) return <ActivityIndicator size="large" color="#f59e0b" className="flex-1 mt-20" />;
  if (!task) return <View />;

  return (
    <ScrollView className="flex-1 bg-warm-cream" contentContainerStyle={{ padding: 16 }}>
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-bold text-stone-800 flex-1">{task.title}</Text>
        <TaskStatusBadge status={task.status} />
      </View>
      <Text className="text-2xl font-bold text-amber-500 mb-4">{task.rewardSb} SB</Text>
      <Card className="mb-4">
        <Text className="text-sm text-stone-600 leading-relaxed">{task.description || "暂无描述"}</Text>
      </Card>
      <Text className="text-xs text-stone-400">发布者: @{task.publisher?.username}</Text>
      {task.status === "open" && task.publisherId !== currentUser?.id && (
        <LinearGradient colors={["#f59e0b", "#d97706"]} className="rounded-xl overflow-hidden mt-4">
          <Pressable className="h-12 items-center justify-center" onPress={handleApply}>
            <Text className="text-white font-bold text-base">申请接单</Text>
          </Pressable>
        </LinearGradient>
      )}
    </ScrollView>
  );
}
