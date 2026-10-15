
import { Suspense } from "react";
import { getProductsByCategory } from "@/utils/api";
import type { Product } from "@/types";
import ProductGrid from "@/components/ProductGrid";
interface CategoryPageProps {
  params: Promise<{ slug: string; }>;
  searchParams: Promise<{ sortPrice?: string | string[] }>;
}

async function CategoryContent({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const requestedSort = Array.isArray(query.sortPrice)
    ? query.sortPrice[0]
    : query.sortPrice;
  const sortPrice = ["low", "high"].includes(requestedSort ?? "")
    ? requestedSort!
    : "default";


  // Convert route slug to category query value
  const categorySlug = decodeURIComponent(slug);
  const categoryName = categorySlug.replace(/-/g, " ");
  const products: unknown = await getProductsByCategory(categorySlug);
  const safeProducts: Product[] = Array.isArray(products)
    ? (products as Product[])
    : [];
  
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-[42px]">

      {/* Header */}
      <header className="flex min-h-[95px] items-center gap-3 rounded-2xl border border-[#dce6dc] bg-[#fafcfb] px-5 py-4 sm:px-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f0] text-[28px]">
          🍚
        </div>

        <div>
          <h1 className="text-2xl font-bold capitalize leading-tight">
            {categoryName}
          </h1>

          <p className="mt-1 text-sm text-[#6b746d]">
            এই বিভাগের পণ্যের আজকের দাম ও পরিবর্তন
          </p>
        </div>
      </header>

      {/* Dynamic Product Grid */}
      <ProductGrid products={safeProducts} sortPrice={sortPrice} />

    </main>
  );
}

export default function CategoryPage(props: CategoryPageProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-7xl px-4 py-12 text-center">
          পণ্য লোড হচ্ছে...
        </main>
      }
    >
      <CategoryContent {...props} />
    </Suspense>
  );
}
