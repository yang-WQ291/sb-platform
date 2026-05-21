import React, { useEffect, useState } from "react";
import { View, TextInput, Pressable, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MessageThread } from "../../../components/market/MessageThread";
import api from "../../../lib/api";
import { getCurrentUser } from "../../../lib/auth";

export default function MessagesPage() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function fetchMessages() {
    try {
      const data = await api.get<any[]>(`/api/messages?with=${userId}`);
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Messages fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchMessages(); getCurrentUser().then(setCurrentUser); }, [userId]);

  async function handleSend() {
    if (!content.trim()) return;
    try {
      await api.post("/api/messages", { toId: userId, content: content.trim() });
      setContent("");
      fetchMessages();
    } catch (err) {
      console.error("Send error:", err);
    }
  }

  if (loading) return <ActivityIndicator size="large" color="#10b981" className="flex-1 mt-20" />;

  return (
    <View className="flex-1 bg-warm-cream">
      <MessageThread messages={messages} currentUserId={currentUser?.id} />
      <View className="flex-row items-center gap-2 p-3 bg-white border-t border-stone-100">
        <TextInput
          className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 h-10 text-sm"
          placeholder="输入消息..."
          placeholderTextColor="#a8a29e"
          value={content}
          onChangeText={setContent}
        />
        <LinearGradient colors={["#10b981", "#059669"]} className="rounded-xl overflow-hidden">
          <Pressable className="h-10 w-14 items-center justify-center" onPress={handleSend}>
            <Text className="text-white font-bold text-sm">发送</Text>
          </Pressable>
        </LinearGradient>
      </View>
    </View>
  );
}
