"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/api";
import Image from "next/image";
import { Star } from "lucide-react";
import AddToCartButton from "@/components/product/add-to-card-button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductDetailClientProps {
  productId: string;
}

export default function ProductDetailClient({
  productId,
}: ProductDetailClientProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(
          `https://fakestoreapi.com/products/${productId}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            router.push("/not-found");
            return;
          }
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError("Failed to load product. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId, router]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
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
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/6 mb-8"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-200 h-[400px] rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/6"></div>
              <div className="h-24 bg-gray-200 rounded w-full"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to products
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="bg-white rounded-lg border p-6 flex items-center justify-center">
          <div className="relative h-[300px] md:h-[400px] w-full">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{product.title}</h1>
            <p className="text-gray-500 mt-2 capitalize">{product.category}</p>
          </div>

          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{product.rating.rate}</span>
            <span className="text-gray-500">
              ({product.rating.count} reviews)
            </span>
          </div>

          <div className="text-3xl font-bold">${product.price.toFixed(2)}</div>

          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
