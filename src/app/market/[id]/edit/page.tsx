import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { EditForm } from "./EditForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product || product.sellerId !== user.id) notFound();

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-emerald-900 mb-6">编辑商品</h1>
      <EditForm product={product} />
    </div>
  );
}
