"use client";

import { useCart } from "@/context/cart-context";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">
            Looks like you haven&apos;t added any products to your cart yet.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="p-6">
              <div className="flow-root">
                <ul className="divide-y">
                  {items.map((item) => (
                    <li key={item.product.id} className="py-6 flex">
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.title}
                          fill
                          sizes="100px"
                          className="object-contain p-2"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3 className="line-clamp-1">
                              <Link href={`/product/${item.product.id}`}>
                                {item.product.title}
                              </Link>
                            </h3>
                            <p className="ml-4">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500 capitalize">
                            {item.product.category}
                          </p>
                        </div>

                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="flex items-center border rounded-md">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              className="p-2"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-2 py-1 min-w-[40px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              className="p-2"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-lg border overflow-hidden sticky top-24">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between border-b pb-4">
                  <div>
                    <p className="text-gray-600">Subtotal</p>
                    <p className="text-sm text-gray-500">
                      {items.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                      items
                    </p>
                  </div>
                  <p className="font-medium">${getCartTotal().toFixed(2)}</p>
                </div>

                <div className="flex justify-between border-b pb-4">
                  <p className="text-gray-600">Shipping</p>
                  <p className="font-medium">Free</p>
                </div>

                <div className="flex justify-between">
                  <p className="font-medium">Total</p>
                  <p className="font-bold text-lg">
                    ${getCartTotal().toFixed(2)}
                  </p>
                </div>

                <button className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                  Checkout
                </button>

                <div className="text-center">
                  <Link
                    href="/"
                    className="text-blue-500 hover:underline text-sm inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
