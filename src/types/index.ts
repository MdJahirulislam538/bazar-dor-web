export interface ProductChange {
  dir?: "up" | "down" | "same" | string;
  pct?: number;
}

export interface ProductMarket {
  market: string;
  division: string;
  min: number;
  max: number;
}

export interface ProductCardProps {
  id?: number | string;
  title?: string;
  subtitle?: string;
  slug?: string;
  name?: string;
  nameBn?: string;
  nameEn?: string;
  category?: string;
  categoryName?: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  unit?: string;
  image?: string;
  today?: number;
  yesterday?: number;
  lastWeek?: number;
  lastMonth?: number;
  price?: number;
  change?: ProductChange;
  markets?: ProductMarket[];
  [key: string]: unknown;
}

export type Product = ProductCardProps;
