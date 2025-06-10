"use client";

import type React from "react";

import type { Product } from "@/lib/api";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { Star, ShoppingCart } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group bg-white rounded-lg border overflow-hidden hover:shadow-md transition-shadow duration-300"
    >
      <div className="relative aspect-square bg-gray-100">
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-contain p-4 transition-opacity duration-300 ${
            isImageLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoadingComplete={() => setIsImageLoading(false)}
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm text-gray-600">
            {product.rating.rate} ({product.rating.count})
          </span>
        </div>
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
          {product.title}
        </h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {product.category}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-bold">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
