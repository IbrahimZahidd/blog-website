import dynamic from "next/dynamic";

// Use dynamic import with ssr: false to ensure the component only renders on client side
const ProductDetailClient = dynamic(
  () => import("@/components/product/product-detail-client"),
  {
    ssr: false,
    loading: () => (
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
    ),
  }
);

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductDetailClient productId={params.id} />;
}
