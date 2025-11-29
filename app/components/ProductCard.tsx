import { Link } from "react-router";
import type { Product } from "../types";
import { ImageWithFallback } from "./ImageWithFallback";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // Get first valid image or use placeholder
  const imageUrl =
    product.images?.[0]?.replace(/[\[\]"]/g, "") ||
    "https://via.placeholder.com/300";

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>
        <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>
        <p className="text-lg font-bold text-gray-900">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
