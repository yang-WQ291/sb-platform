import React, { useEffect, useState } from "react";
import { ScrollView, RefreshControl, View } from "react-native";
import { TaskCard } from "../../components/tasks/TaskCard";
import { EmptyState } from "../../components/ui/EmptyState";
import api from "../../lib/api";

export default function TasksTab() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTasks() {
    setLoading(true);
    try {
      const data = await api.get<any>("/api/tasks");
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      console.error("Tasks fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchTasks(); }, []);

  return (
    <ScrollView className="flex-1 bg-warm-cream px-4 pt-4" refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchTasks} />}>
      {tasks.length > 0 ? tasks.map((t: any) => <TaskCard key={t.id} task={t} />) : <EmptyState icon="🎯" title="暂无悬赏任务" />}
      <View className="h-20" />
    </ScrollView>
  );
}
