
"use client";

import { Suspense, useEffect, useState } from "react";
import type { Product as ProductType } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

const API_URL = "https://openapi.programming-hero.com/api/bazardor";

const formatBn = (value?: number) =>
  new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value ?? 0);

function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError("");

        let response = await fetch(
          `${API_URL}/products/${encodeURIComponent(id)}`,
          { cache: "no-store" },
        );

        if (!response.ok && !/^\d+$/.test(id)) {
          response = await fetch(`${API_URL}/products`, { cache: "no-store" });
        }

        if (!response.ok) {
          throw new Error("পণ্যের তথ্য লোড করা যায়নি");
        }

        const result = await response.json();
        const responseData = result.data ?? result.product ?? result;
        const data = Array.isArray(responseData)
          ? responseData.find(
              (item) => String(item.id) === id || item.slug === id,
            )
          : responseData;

        if (!data || typeof data !== "object") {
          throw new Error("পণ্যের তথ্য পাওয়া যায়নি");
        }

        setProduct(data as ProductType);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "কিছু একটা সমস্যা হয়েছে",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl animate-pulse px-3 py-5 sm:px-5">
        <div className="mb-5 h-32 rounded-2xl bg-gray-200" />
        <div className="mb-4 h-6 w-48 rounded bg-gray-200" />
        <div className="grid gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-28 rounded-xl bg-gray-200" />
          ))}
        </div>
        <div className="mt-5 h-64 rounded-2xl bg-gray-200" />
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="mx-auto max-w-7xl px-3 py-12 text-center">
        <p className="text-red-600">
          {error || "পণ্যের তথ্য পাওয়া যায়নি"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-green-700 px-5 py-2 text-white"
        >
          আবার চেষ্টা করুন
        </button>
      </section>
    );
  }

  const title =
    product.nameBn ||
    product.title ||
    product.name ||
    product.nameEn ||
    "পণ্যের নাম";

  const today = product.today ?? product.price ?? 0;
  const yesterday = product.yesterday ?? today;
  const difference = today - yesterday;

  const changePercent =
    product.change?.pct ??
    (yesterday !== 0
      ? (Math.abs(difference) / yesterday) * 100
      : 0);

  const direction =
    product.change?.dir ??
    (difference > 0 ? "up" : difference < 0 ? "down" : "same");

  const icon = product.categoryIcon || "🍚";
  const imageUrl =
    typeof product.image === "string" && /^https?:\/\//i.test(product.image);
  const markets = Array.isArray(product.markets) ? product.markets : [];
  const lowestMarketPrice = markets.length
    ? Math.min(...markets.map((market) => market.min))
    : today;
  const highestMarketPrice = markets.length
    ? Math.max(...markets.map((market) => market.max))
    : today;

  return (
    <section className="mx-auto max-w-7xl px-3 py-5 sm:px-5 lg:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-green-700">
          হোম
        </Link>
        <span>›</span>
        <span>{product.categoryNameBn || product.categoryName || product.category || "পণ্য"}</span>
        <span>›</span>
        <span className="text-gray-900">{title}</span>
      </nav>

      {/* Product Header */}
      <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-[#e0e9e1] bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f0f5f0]">
            {imageUrl ? (
              <Image
                src={product.image!}
                alt={title}
                className="h-full w-full object-contain p-2"
                width={64}
                height={64}
                priority
              />
            ) : (
              <span className="text-4xl">{product.image || icon}</span>
            )}
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#253329] sm:text-2xl">
              {title}
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              {product.unit || "প্রতি কেজি"} ·{" "}
              {product.categoryNameBn || product.categoryName || product.category || "পণ্য"}
            </p>

            <p className="mt-2 text-xs text-gray-700">
              {difference > 0
                ? `গতকালের তুলনায় আজ দাম বেড়েছে ${formatBn(Math.abs(difference))} টাকা`
                : difference < 0
                  ? `গতকালের তুলনায় আজ দাম কমেছে ${formatBn(Math.abs(difference))} টাকা`
                  : "গতকালের তুলনায় আজ দামের পরিবর্তন নেই"}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-[#f0f5f0] px-6 py-3 text-center sm:min-w-28">
          <p className="text-xs text-gray-500">আজকের দাম</p>
          <p className="text-3xl font-bold text-[#253329]">
            {formatBn(today)}
          </p>
          <p className="text-xs text-gray-500">
            টাকা / {product.unit || "কেজি"}
          </p>

          <p
            className={`mt-1 text-xs font-semibold ${
              direction === "up"
                ? "text-red-500"
                : direction === "down"
                  ? "text-green-600"
                  : "text-gray-500"
            }`}
          >
            {direction === "up" ? "▲" : direction === "down" ? "▼" : "—"}{" "}
            {formatBn(changePercent)}%
          </p>
        </div>
      </div>

      {/* Price Summary */}
      <div className="rounded-2xl border border-[#e0e9e1] bg-white/80 p-4 sm:p-5">
        <h2 className="mb-3 text-sm font-bold text-[#253329] sm:text-base">
          দামের সারসংক্ষেপ
        </h2>

        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[#e0e9e1] p-4">
            <p className="text-xs text-gray-500">সর্বনিম্ন দাম</p>
            <p className="mt-1 text-2xl font-bold text-green-600">
              {formatBn(lowestMarketPrice)} টাকা
            </p>
            <p className="mt-1 text-xs text-gray-600">
              বর্তমান পণ্যের দাম
            </p>
          </div>

          <div className="rounded-xl border border-[#e0e9e1] p-4">
            <p className="text-xs text-gray-500">সর্বোচ্চ দাম</p>
            <p className="mt-1 text-2xl font-bold text-red-500">
              {formatBn(highestMarketPrice)} টাকা
            </p>
            <p className="mt-1 text-xs text-gray-600">
              উপলভ্য মূল্য তথ্য
            </p>
          </div>

          <div className="rounded-xl border border-[#e0e9e1] p-4">
            <p className="text-xs text-gray-500">গতকালের দাম</p>
            <p className="mt-1 text-2xl font-bold text-green-600">
              {formatBn(yesterday)} টাকা
            </p>
            <p className="mt-1 text-xs text-gray-600">
              প্রতি {product.unit || "কেজি"}
            </p>
          </div>
        </div>

        {/* Market Table */}
        <h2 className="mb-3 text-sm font-bold text-[#253329] sm:text-base">
          বাজারভিত্তিক আজকের দাম
        </h2>

        <div className="overflow-x-auto rounded-xl border border-[#e0e9e1]">
          <table className="w-full min-w-[600px] text-left text-xs">
            <thead className="bg-[#f8faf8] text-gray-500">
              <tr>
                <th className="px-4 py-3">বাজার</th>
                <th className="px-4 py-3">বিভাগ</th>
                <th className="px-4 py-3 text-right">সর্বনিম্ন</th>
                <th className="px-4 py-3 text-right">সর্বোচ্চ</th>
                <th className="px-4 py-3 text-right">গড়</th>
              </tr>
            </thead>

            <tbody>
              {markets.length > 0 ? (
                markets.map((market) => (
                  <tr
                    key={`${market.division}-${market.market}`}
                    className="border-t border-[#e0e9e1] bg-[#fbfcfb]"
                  >
                    <td className="px-4 py-4 font-medium text-[#29372d]">
                      {market.market}
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      {market.division}
                    </td>
                    <td className="px-4 py-4 text-right">
                      {formatBn(market.min)} টাকা
                    </td>
                    <td className="px-4 py-4 text-right">
                      {formatBn(market.max)} টাকা
                    </td>
                    <td className="px-4 py-4 text-right font-bold">
                      {formatBn((market.min + market.max) / 2)} টাকা
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
}

export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <section className="mx-auto max-w-7xl px-3 py-12 text-center text-gray-500 sm:px-5">
          পণ্যের তথ্য লোড হচ্ছে...
        </section>
      }
    >
      <ProductDetails />
    </Suspense>
  );
}
