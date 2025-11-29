import type { HTMLAttributes } from "react";
import type { CartItem as CartItemType, Product } from "../types";
import { ImageWithFallback } from "./ImageWithFallback";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product, quantity } = item;
  const imageUrl = product.images?.[0]?.replace(/[\[\]"]/g, "");
  const subtotal = product.price * quantity;

  return (
    <div className="flex gap-4 py-4 border-b border-gray-200">
      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{product.title}</h3>
          <p className="text-sm text-gray-500">{product.category.name}</p>
          <p className="text-sm font-medium text-gray-900 mt-1">
            ${product.price.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-lg text-white bg-blue-600"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-8 text-center font-medium text-gray-900">
              {quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-white bg-blue-600"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            onClick={() => onRemove(product.id)}
            className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="flex items-start">
        <p className="font-bold text-gray-900">${subtotal.toFixed(2)}</p>
      </div>
    </div>
  );
}
