import React from 'react';
import Link from "next/link";
import type { ProductCardProps as Product } from "@/types";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  icon: string;
  iconColor: string;
  products: Product[];
}

const ProductSection = ({ title, subtitle, icon, iconColor, products }: ProductSectionProps) => {
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <span className={`text-lg font-bold ${iconColor}`}>{icon}</span>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      {subtitle && <p className="mb-4 text-gray-600">{subtitle}</p>}

      {safeProducts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
          কোনো পণ্য পাওয়া যায়নি.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {safeProducts.map((product) => (
            <Link
              href={`/product/${encodeURIComponent(String(product.id ?? product.slug))}`}
              key={product.id ?? `${product.nameBn}-${product.today}`}
              className="block rounded-2xl border border-[#dce5dd] bg-[#fbfdfb] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#b9d7c2] hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f0] text-2xl">
                  {product.categoryIcon || '📦'}
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#253129]">
                    {product.nameBn || 'নাম পাওয়া যায়নি'}
                  </h3>
                  <p className="mt-0.5 text-xs text-[#68736b]">
                    {product.unit || 'একক'}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-end justify-between gap-2">
                <div>
                  <p className="text-xs text-[#68736b]">আজকের দাম</p>
                  <p className="mt-1 text-lg font-extrabold text-[#202923]">
                    {Number(product.today ?? 0).toFixed(2)}{' '}
                    <span className="text-sm font-medium">টাকা</span>
                  </p>
                </div>

                {product.change && (
                  <div className={`mb-0.5 inline-flex items-center gap-1 rounded-full bg-[#f0f5f0] px-2.5 py-1 text-xs font-semibold ${iconColor}`}>
                    <span className="font-bold">{icon}</span>
                    <span>{Number(product.change.pct ?? 0).toFixed(2)}%</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductSection;