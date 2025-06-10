// src/app/product/[id]/page.tsx
import ProductDetailClientWrapper from "@/components/product/ProductDetailClientWrapper";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductDetailClientWrapper productId={params.id} />;
}
