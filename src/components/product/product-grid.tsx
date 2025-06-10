"use client";

import type { Product } from "@/lib/api";
import ProductCard from "./product-card";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

interface ProductGridProps {
  initialProducts: Product[];
}

export default function ProductGrid({ initialProducts }: ProductGridProps) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const sortBy = searchParams.get("sort");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...initialProducts];

    // Apply category filter
    if (category && category !== "all") {
      result = result.filter((product) => product.category === category);
    }

    // Apply price filter
    if (minPrice) {
      result = result.filter((product) => product.price >= Number(minPrice));
    }

    if (maxPrice) {
      result = result.filter((product) => product.price <= Number(maxPrice));
    }

    // Apply sorting
    if (sortBy) {
      switch (sortBy) {
        case "price-asc":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          result.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          result.sort((a, b) => b.rating.rate - a.rating.rate);
          break;
        default:
          // Default sorting (by id)
          result.sort((a, b) => a.id - b.id);
      }
    }

    return result;
  }, [initialProducts, category, sortBy, minPrice, maxPrice]);

  if (filteredAndSortedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No products found</h3>
        <p className="text-gray-500 mt-2">
          Try changing your filters or search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredAndSortedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
