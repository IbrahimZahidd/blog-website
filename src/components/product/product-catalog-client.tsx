"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/api";
import ProductGrid from "./product-grid";
import FilterSidebar from "./filter-sidebar";
import SortDropdown from "./sort-dropdown";
import ProductSkeleton from "./product-skeleton";

export default function ProductCatalogClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch products and categories in parallel
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch("https://fakestoreapi.com/products"),
          fetch("https://fakestoreapi.com/products/categories"),
        ]);

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-red-500">{error}</h3>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (loading) {
    return <ProductSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
      <FilterSidebar categories={categories} />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">{products.length} products</p>
          <SortDropdown />
        </div>
        <ProductGrid initialProducts={products} />
      </div>
    </div>
  );
}
