import type { Product, Category } from "../types";

const API_BASE_URL = "https://api.escuelajs.co/api/v1";

export const api = {
  // Get all products with optional filters
  async getProducts(params?: {
    title?: string;
    categoryId?: number;
    offset?: number;
    limit?: number;
  }): Promise<Product[]> {
    const searchParams = new URLSearchParams();

    if (params?.title) {
      searchParams.append("title", params.title);
    }
    if (params?.categoryId) {
      searchParams.append("categoryId", params.categoryId.toString());
    }
    if (params?.offset !== undefined) {
      searchParams.append("offset", params.offset.toString());
    }
    if (params?.limit !== undefined) {
      searchParams.append("limit", params.limit.toString());
    }

    const url = `${API_BASE_URL}/products${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return response.json();
  },

  // Get single product by ID
  async getProduct(id: number): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    return response.json();
  },

  // Get all categories
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories`);

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    return response.json();
  },

  // Simulate adding to cart (optimistic update)
  async addToCart(productId: number): Promise<{ success: boolean }> {
    // Simulating API call with delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simulate 95% success rate
    const success = Math.random() > 0.05;

    if (!success) {
      throw new Error("Failed to add product to cart");
    }

    return { success: true };
  },
};
