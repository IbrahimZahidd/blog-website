"use client";

import type { Product } from "@/lib/api";
import { useCart } from "@/context/cart-context";
import { ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setIsAddedToCart(true);

    // Reset the added state after 2 seconds
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleAddToCart}
        className={`w-full py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors ${
          isAddedToCart
            ? "bg-green-500 hover:bg-green-600 text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        <ShoppingCart className="h-5 w-5" />
        {isAddedToCart ? "Added to Cart!" : "Add to Cart"}
      </button>

      <button className="w-full py-3 px-4 border border-gray-300 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
        <Heart className="h-5 w-5" />
        Add to Wishlist
      </button>
    </div>
  );
}
