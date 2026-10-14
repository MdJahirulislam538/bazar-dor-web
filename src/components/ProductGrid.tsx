
import type { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";

interface ProductGridProps {
  products: Product[];
  sortPrice: string;
}

function getProductName(product: Product): string {
  return (
    product.nameBn ||
    product.title ||
    product.name ||
    product.nameEn ||
    "পণ্যের নাম"
  );
}

function getProductPrice(product: Product): number {
  const price = product.today ?? product.price ?? 0;
  const parsedPrice = Number(price);

  return Number.isFinite(parsedPrice) ? parsedPrice : 0;
}

function getProductId(product: Product, index: number) {
  return product.id ?? product.slug ?? `${getProductName(product)}-${index}`;
}

function getProductImageUrl(image?: string): string | null {
  if (!image) return null;
  if (image.startsWith("/")) return image;

  try {
    const url = new URL(image);
    return url.protocol === "http:" || url.protocol === "https:"
      ? image
      : null;
  } catch {
    return null;
  }
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);

export default function ProductGrid({ products, sortPrice }: ProductGridProps) {
  const sortedProducts = [...products];

  if (sortPrice === "low") {
    sortedProducts.sort(
      (a, b) => getProductPrice(a) - getProductPrice(b)
    );
  }

  if (sortPrice === "high") {
    sortedProducts.sort(
      (a, b) => getProductPrice(b) - getProductPrice(a)
    );
  }

  return (
    <>
      {/* Sorting */}
      <section className="mt-6 flex min-h-[67px] items-center justify-end rounded-2xl border border-[#dce6dc] bg-[#fafcfb] px-4 py-3 sm:px-6">
        <form method="get" className="flex items-center gap-2">
          <label
            htmlFor="sortPrice"
            className="text-sm text-[#6b746d]"
          >
            সাজান
          </label>

          <select
            id="sortPrice"
            name="sortPrice"
            defaultValue={sortPrice}
            className="rounded-lg border border-[#cfd8cf] bg-transparent px-3 py-2 text-sm"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low">দাম: কম থেকে বেশি</option>
            <option value="high">দাম: বেশি থেকে কম</option>
          </select>
          <button
            type="submit"
            className="rounded-lg bg-[#253129] px-3 py-2 text-sm font-medium text-white"
          >
            সাজান
          </button>
        </form>
      </section>

      {/* Product Count */}
      <div className="mb-4 mt-4">
        <p className="text-sm text-[#6b746d]">
          মোট {formatNumber(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
        </p>
      </div>

      {/* Product Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product, index) => {
            const price = getProductPrice(product);
            const name = getProductName(product);
            const productId = product.id ?? product.slug;
            const imageUrl = getProductImageUrl(product.image);
            const change = product.change;
            const percentage = Number(change?.pct);
            const hasChange =
              change?.pct !== undefined &&
              Number.isFinite(percentage);

            const direction = change?.dir;

            const isUp = direction === "up";
            const isDown = direction === "down";

            const changeColor = isUp
              ? "text-red-500"
              : isDown
                ? "text-green-600"
                : "text-[#687169]";

            const changeIcon = isUp
              ? "▲"
              : isDown
                ? "▼"
                : "—";

            return (
              <Link
                href={`/product/${encodeURIComponent(String(productId))}`}
                key={getProductId(product, index)}
                className="block rounded-2xl border border-[#dce6dc] bg-[#fafcfb] p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f0f5f0] text-[26px]">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={name}
                        className="h-full w-full object-cover"
                        width={48}
                        height={48}
                      />
                    ) : (
                      product.image || product.categoryIcon || "🍚"
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-base font-semibold">
                      {name}
                    </h2>

                    <p className="mt-0.5 text-xs text-[#687169]">
                      {product.unit
                        ? `প্রতি ${product.unit}`
                        : "প্রতি কেজি"}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-[#687169]">
                    আজকের দাম
                  </p>

                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="text-xl font-bold leading-none">
                      {formatNumber(price)}{" "}
                      <span className="text-sm font-medium">
                        টাকা
                      </span>
                    </p>

                    {hasChange && (
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full bg-[#f0f5f0] px-2.5 py-1 text-xs font-semibold ${changeColor}`}
                      >
                        {changeIcon} {formatNumber(Math.abs(percentage))}%
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full rounded-2xl border border-[#dce6dc] bg-[#fafcfb] px-4 py-10 text-center text-sm text-[#687169]">
            এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
          </div>
        )}
      </section>
    </>
  );
}
