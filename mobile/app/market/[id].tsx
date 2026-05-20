import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert, ActivityIndicator, TextInput, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Card } from "../../components/ui/Card";
import { ProductStatusBadge } from "../../components/market/ProductStatusBadge";
import { ReviewStarsDisplay, ReviewStarsInput } from "../../components/market/ReviewStars";
import { FavoriteButton } from "../../components/market/FavoriteButton";
import { EmptyState } from "../../components/ui/EmptyState";
import { LinearGradient } from "expo-linear-gradient";
import api from "../../lib/api";
import { getCurrentUser } from "../../lib/auth";

export default function ProductDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  async function fetchProduct() {
    setLoading(true);
    try {
      const data = await api.get<any>(`/api/market/${id}`);
      setProduct(data);
    } catch (err) {
      Alert.alert("错误", "商品不存在或已删除");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchProduct(); }, [id]);
  useEffect(() => { getCurrentUser().then(setCurrentUser); }, []);

  async function handleBuy() {
    Alert.alert("确认购买", `确定要用 ${product.price} SB 购买该商品吗？`, [
      { text: "取消", style: "cancel" },
      {
        text: "确认购买",
        onPress: async () => {
          try {
            await api.post(`/api/market/${id}/buy`);
            Alert.alert("购买成功", "商品已归你所有！");
            fetchProduct();
          } catch (err: any) {
            Alert.alert("购买失败", err.message);
          }
        },
      },
    ]);
  }

  async function handleReview() {
    if (reviewRating === 0) { Alert.alert("提示", "请先评分"); return; }
    try {
      await api.post(`/api/market/${id}/review`, { rating: reviewRating, comment: reviewComment });
      Alert.alert("评价成功");
      setReviewRating(0);
      setReviewComment("");
      fetchProduct();
    } catch (err: any) {
      Alert.alert("评价失败", err.message);
    }
  }

  if (loading) return <ActivityIndicator size="large" color="#10b981" className="flex-1 mt-20" />;
  if (!product) return <EmptyState title="商品不存在" />;

  const isSeller = currentUser?.id === product.sellerId;

  return (
    <ScrollView className="flex-1 bg-warm-cream" contentContainerStyle={{ padding: 16 }}>
      <View className="w-full h-48 rounded-2xl bg-emerald-50 items-center justify-center mb-4">
        <Text className="text-6xl">📦</Text>
      </View>

      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-bold text-stone-800 flex-1">{product.title}</Text>
        <ProductStatusBadge status={product.status} />
      </View>

      <Text className="text-2xl font-bold text-amber-500 mb-4">{product.price} SB</Text>

      <Card className="mb-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-semibold text-stone-800">@{product.seller?.username}</Text>
            {product.sellerRating != null && (
              <ReviewStarsDisplay rating={product.sellerRating.average} count={product.sellerRating.count} />
            )}
          </View>
          <FavoriteButton productId={product.id} />
        </View>
      </Card>

      {product.description ? (
        <View className="mb-4">
          <Text className="text-sm font-semibold text-stone-600 mb-1">商品描述</Text>
          <Text className="text-sm text-stone-500 leading-relaxed">{product.description}</Text>
        </View>
      ) : null}

      {product.status === "active" && !isSeller && (
        <LinearGradient colors={["#10b981", "#059669"]} className="rounded-xl overflow-hidden mb-4">
          <Pressable className="h-12 items-center justify-center" onPress={handleBuy}>
            <Text className="text-white font-bold text-base">立即购买</Text>
          </Pressable>
        </LinearGradient>
      )}

      {product.status === "sold" && !isSeller && (
        <View className="mb-4">
          <Text className="text-sm font-semibold text-stone-600 mb-2">评价卖家</Text>
          <ReviewStarsInput rating={reviewRating} onChange={setReviewRating} />
          <TextInput
            className="bg-white border border-stone-200 rounded-xl p-3 min-h-[80px] mt-2 text-sm"
            placeholder="写下你的评价..."
            placeholderTextColor="#a8a29e"
            value={reviewComment}
            onChangeText={setReviewComment}
            multiline
          />
          <LinearGradient colors={["#f59e0b", "#d97706"]} className="rounded-xl overflow-hidden mt-2">
            <Pressable className="h-10 items-center justify-center" onPress={handleReview}>
              <Text className="text-white font-bold text-sm">提交评价</Text>
            </Pressable>
          </LinearGradient>
        </View>
      )}
    </ScrollView>
  );
}
