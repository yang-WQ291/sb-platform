import React, { useEffect, useState } from "react";
import { Text, ScrollView, ActivityIndicator } from "react-native";
import { ProductCard } from "../../components/market/ProductCard";
import { EmptyState } from "../../components/ui/EmptyState";
import api from "../../lib/api";

export default function MyMarketPage() {
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const [products, favData] = await Promise.all([
          api.get<any>("/api/market?mine=true"),
          api.get<any>("/api/market?favorites=true"),
        ]);
        setMyProducts(products.products || []);
        setFavorites(favData.products || []);
      } catch (err) {
        console.error("My market fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#10b981" className="flex-1 mt-20" />;

  return (
    <ScrollView className="flex-1 bg-warm-cream" contentContainerStyle={{ padding: 16 }}>
      <Text className="text-base font-bold text-stone-800 mb-3">📦 我发布的</Text>
      {myProducts.length > 0 ? myProducts.map((p: any) => <ProductCard key={p.id} product={p} />) : <EmptyState title="暂无发布" />}
      <Text className="text-base font-bold text-stone-800 mb-3 mt-4">⭐ 我收藏的</Text>
      {favorites.length > 0 ? favorites.map((p: any) => <ProductCard key={p.id} product={p} />) : <EmptyState title="暂无收藏" />}
    </ScrollView>
  );
}
