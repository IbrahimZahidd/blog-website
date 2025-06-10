"use client";

import type { Product } from "@/lib/api";
import ProductGrid from "./product-grid";

interface ClientProductGridProps {
  initialProducts: Product[];
}

// This is a client component wrapper that can access the CartProvider
export default function ClientProductGrid({
  initialProducts,
}: ClientProductGridProps) {
  return <ProductGrid initialProducts={initialProducts} />;
}
