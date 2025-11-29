import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";
import { Header } from "../components/Header";
import { LoadingSpinner } from "../components/Loading";
import { ErrorMessage } from "../components/ErrorMessage";
import { ImageWithFallback } from "~/components/ImageWithFallback";
import { useAlert } from "../context/AlertContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, removeItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const { showAlert } = useAlert();

  const productId = Number(id);

  // Fetch product details
  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => api.getProduct(productId),
    enabled: !isNaN(productId),
  });

  // Optimistic add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: (productId: number) => api.addToCart(productId),
    onMutate: async () => {
      if (product) {
        addItem(product);
      }
      return { product }; // Return context for rollback
    },
    onError: (error, variables, context) => {
      // ROLLBACK: Remove the item that was optimistically added
      if (context?.product) {
        removeItem(context.product.id);
      }
      showAlert("error", "Failed to add item to cart. Please try again.");
    },
    onSuccess: () => {
      showAlert("success", "Product added to cart successfully!");
    },
  });
  const handleAddToCart = () => {
    if (product) {
      addToCartMutation.mutate(product.id);
    }
  };

  if (isNaN(productId)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <ErrorMessage
            title="Invalid Product"
            message="The product ID is invalid."
            onRetry={() => navigate("/")}
          />
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <LoadingSpinner size="lg" />
        </main>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <ErrorMessage
            title="Failed to load product"
            message={error?.message || "Product not found"}
            onRetry={() => refetch()}
          />
        </main>
      </div>
    );
  }

  const images = product.images
    ?.map((img) => img.replace(/[\[\]"]/g, ""))
    .filter(Boolean) || ["https://via.placeholder.com/600"];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <span>←</span> Back to Products
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Images */}
            <div>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <ImageWithFallback
                  src={images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index
                          ? "border-blue-600"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <ImageWithFallback
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  {product.category.name}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>

              <p className="text-4xl font-bold text-gray-900 mb-6">
                ${product.price.toFixed(2)}
              </p>

              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="mt-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending}
                  className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
                </button>

                {addToCartMutation.isError && (
                  <p className="text-red-600 text-sm mt-2">
                    Failed to add to cart. Please try again.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Global Alert handled by AlertProvider */}
    </div>
  );
}
