"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface FilterSidebarProps {
  categories: string[];
}

export default function FilterSidebar({ categories }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const currentCategory = searchParams.get("category") || "all";

  // Create a new URLSearchParams instance to manipulate
  const createQueryString = (params: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    // Update or delete each parameter
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    });

    return newSearchParams.toString();
  };

  const handleCategoryChange = (category: string) => {
    const query = createQueryString({
      category: category === "all" ? null : category,
    });
    router.push(`${pathname}?${query}`);
  };

  const handlePriceFilter = () => {
    const query = createQueryString({
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
    });
    router.push(`${pathname}?${query}`);
  };

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    router.push(pathname);
  };

  return (
    <>
      {/* Mobile filter toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="w-full py-2 px-4 bg-gray-100 rounded-md text-left flex justify-between items-center"
        >
          <span>Filters</span>
          <span>{isMobileFilterOpen ? "−" : "+"}</span>
        </button>
      </div>

      {/* Filter sidebar - hidden on mobile unless toggled */}
      <div
        className={`space-y-6 ${
          isMobileFilterOpen ? "block" : "hidden"
        } md:block`}
      >
        <div>
          <h3 className="font-medium text-lg mb-3">Categories</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={currentCategory === "all"}
                onChange={() => handleCategoryChange("all")}
                className="rounded text-blue-500 focus:ring-blue-500"
              />
              <span>All Categories</span>
            </label>
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="category"
                  checked={currentCategory === category}
                  onChange={() => handleCategoryChange(category)}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span className="capitalize">{category.replace("'", "")}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium text-lg mb-3">Price Range</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="min-price" className="text-sm text-gray-600">
                  Min
                </label>
                <input
                  id="min-price"
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label htmlFor="max-price" className="text-sm text-gray-600">
                  Max
                </label>
                <input
                  id="max-price"
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="1000"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
            <button
              onClick={handlePriceFilter}
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>

        <button
          onClick={clearFilters}
          className="text-blue-500 hover:underline text-sm"
        >
          Clear all filters
        </button>
      </div>
    </>
  );
}
