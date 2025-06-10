import { getProducts, getCategories } from "@/lib/api";
import FilterSidebar from "./filter-sidebar";
import SortDropdown from "./sort-dropdown";
import { Suspense } from "react";
import ProductSkeleton from "./product-skeleton";
import ClientProductGrid from "./client-product-grid";

export default async function ProductCatalog() {
  // Fetch data on the server
  const productsPromise = getProducts();
  const categoriesPromise = getCategories();

  const [products, categories] = await Promise.all([
    productsPromise,
    categoriesPromise,
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
      <FilterSidebar categories={categories} />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">{products.length} products</p>
          <SortDropdown />
        </div>
        <Suspense fallback={<ProductSkeleton />}>
          <ClientProductGrid initialProducts={products} />
        </Suspense>
      </div>
    </div>
  );
}
