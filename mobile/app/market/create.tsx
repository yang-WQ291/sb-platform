import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import api from "../../lib/api";

const categories = ["数码", "书籍", "生活", "其他"];

export default function CreateProductPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("其他");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!title.trim() || !price) { Alert.alert("提示", "标题和价格必填"); return; }
    setLoading(true);
    try {
      await api.post("/api/market", {
        title: title.trim(),
        description,
        price: parseInt(price),
        category,
        images: imageUrl ? JSON.stringify([imageUrl]) : "[]",
      });
      Alert.alert("发布成功", "商品已上架", [{ text: "好的", onPress: () => router.back() }]);
    } catch (err: any) {
      Alert.alert("发布失败", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-warm-cream" contentContainerStyle={{ padding: 16 }}>
      <Text className="text-sm font-semibold text-stone-600 mb-1">标题 *</Text>
      <TextInput className="bg-white border border-stone-200 rounded-xl px-4 h-12 mb-4 text-stone-800" placeholder="商品标题" placeholderTextColor="#a8a29e" value={title} onChangeText={setTitle} />

      <Text className="text-sm font-semibold text-stone-600 mb-1">价格 (SB) *</Text>
      <TextInput className="bg-white border border-stone-200 rounded-xl px-4 h-12 mb-4 text-stone-800" placeholder="输入价格" placeholderTextColor="#a8a29e" keyboardType="numeric" value={price} onChangeText={setPrice} />

      <Text className="text-sm font-semibold text-stone-600 mb-1">分类</Text>
      <View className="flex-row flex-wrap gap-2 mb-4">
        {categories.map((c) => (
          <Pressable key={c} onPress={() => setCategory(c)} className={`rounded-full px-4 py-2 ${category === c ? "bg-emerald-500" : "bg-white border border-stone-200"}`}>
            <Text className={`text-sm ${category === c ? "text-white" : "text-stone-600"}`}>{c}</Text>
          </Pressable>
        ))}
      </View>

      <Text className="text-sm font-semibold text-stone-600 mb-1">描述</Text>
      <TextInput className="bg-white border border-stone-200 rounded-xl p-3 min-h-[100px] mb-4 text-stone-800" placeholder="描述商品成色、使用情况等" placeholderTextColor="#a8a29e" value={description} onChangeText={setDescription} multiline />

      <Text className="text-sm font-semibold text-stone-600 mb-1">图片 URL（可选）</Text>
      <TextInput className="bg-white border border-stone-200 rounded-xl px-4 h-12 mb-6 text-stone-800" placeholder="https://..." placeholderTextColor="#a8a29e" value={imageUrl} onChangeText={setImageUrl} />

      <LinearGradient colors={["#10b981", "#059669"]} className="rounded-xl overflow-hidden">
        <Pressable className="h-12 items-center justify-center" onPress={handleCreate} disabled={loading}>
          <Text className="text-white font-bold text-base">{loading ? "发布中..." : "发布商品"}</Text>
        </Pressable>
      </LinearGradient>
    </ScrollView>
  );
}
