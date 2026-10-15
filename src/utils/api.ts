// Base URL for Programming Hero Bazar Dor API
import { unstable_rethrow } from "next/navigation";

const BASE_URL =
  "https://openapi.programming-hero.com/api/bazardor";

// Fetch all products
export async function getAllProducts() {
  try {
    const res = await fetch(`${BASE_URL}/products`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }

    const json = await res.json();

    return Array.isArray(json) ? json : json?.data || [];
  } catch (error) {
    unstable_rethrow(error);
    console.error("Error fetching all products:", error);
    return [];
  }
}

// Fetch categories
export async function getCategories() {
  try {
    const res = await fetch(`${BASE_URL}/categories`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.statusText}`);
    }

    const json = await res.json();

    return Array.isArray(json) ? json : json?.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Fetch products by category
export async function getProductsByCategory(
  categoryName: string
) {
  try {
    const res = await fetch(
      `${BASE_URL}/products?category=${encodeURIComponent(categoryName)}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(
        `Failed to fetch products for category ${categoryName}`
      );
    }

    const json = await res.json();

    return Array.isArray(json) ? json : json?.data || [];
  } catch (error) {
    unstable_rethrow(error);
    console.error(`Error fetching category ${categoryName}:`, error);
    return [];
  }
}