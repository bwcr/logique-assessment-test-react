import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { Header } from "../components/Header";
import { ProductCard } from "../components/ProductCard";
import { LoadingGrid } from "../components/Loading";
import { ErrorMessage } from "../components/ErrorMessage";
import { useDebounce } from "@uidotdev/usehooks";

export function meta() {
  return [
    { title: "Products - Shop Explorer" },
    { name: "description", content: "Browse our product catalog" },
  ];
}

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined
  );
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.getCategories(),
  });

  // Fetch products with filters
  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products", debouncedSearchQuery, selectedCategory],
    queryFn: () =>
      api.getProducts({
        title: debouncedSearchQuery || undefined,
        categoryId: selectedCategory,
        limit: 50,
      }),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Products</h1>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
              />
            </div>

            {/* Category filter */}
            <div className="md:w-64">
              <select
                value={selectedCategory ?? ""}
                onChange={(e) =>
                  setSelectedCategory(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
              >
                <option value="">All Categories</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <LoadingGrid />
        ) : isError ? (
          <ErrorMessage
            title="Failed to load products"
            message={
              error?.message || "An error occurred while fetching products"
            }
            onRetry={() => refetch()}
          />
        ) : products && products.length > 0 ? (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Showing {products.length}{" "}
              {products.length === 1 ? "product" : "products"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
