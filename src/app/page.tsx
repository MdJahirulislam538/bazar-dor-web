import { Suspense } from "react";
import HeroBanner from "@/components/home/HeroBanner";
import ProductSection from "@/components/home/ProductSection";
import type { ProductCardProps } from "@/types";
import { getAllProducts } from "@/utils/api";

async function HomeContent() {
  const products: ProductCardProps[] = await getAllProducts();
  const safeProducts = Array.isArray(products) ? products : [];

  const priceIncreased = safeProducts.filter((product) => product.change?.dir === "up");
  const priceDecreased = safeProducts.filter((product) => product.change?.dir === "down");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* ১. হিরো ব্যানার */}
      <HeroBanner />

      {/* ২. আজ দাম বেড়েছে */}
      <ProductSection
        title="আজ দাম বেড়েছে"
        icon="▲"
        iconColor="text-red-500"
        products={priceIncreased.slice(0, 6)}
      />
      
      {/* ৩. আজ দাম কমেছে */}
      <ProductSection 
        title="আজ দাম কমেছে" 
        icon="▼"
        iconColor="text-emerald-600"
        products={priceDecreased.slice(0, 6)}
      />

      {/* ৪. সব পণ্য */}
      <ProductSection
        title="সব পণ্য"
        subtitle={`মোট পণ্য: ${products.length} টির মধ্যে`}
        icon="🛒"
        iconColor="text-blue-600"
        products={products}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
          পণ্য লোড হচ্ছে...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}