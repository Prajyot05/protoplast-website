"use server";

import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function requireAdmin() {
  const { userId, sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;

  if (!userId || role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }
  return { success: true };
}


// Get all products
export async function getAllProducts() {
  try {
    await connectDB();
    const products = await Product.find().lean();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(products)),
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      error: "Failed to fetch products",
    };
  }
}

// Get one product
export async function getProductById(id: string) {
  try {
    await connectDB();
    const product = await Product.findById(id).lean();
    if (!product) {
      return {
        success: false,
        error: "Product not found",
      };
    }
    return {
      success: true,
      data: JSON.parse(JSON.stringify(product)),
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return {
      success: false,
      error: "Failed to fetch product",
    };
  }
}

// Create product
export async function createProduct(data: {
  title: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  specs?: Record<string, string>;
  featured?: boolean;
}) {
  const authCheck = await requireAdmin();
  if (!authCheck.success) {
    return { success: false, error: authCheck.error };
  }
  try {
    await connectDB();

    const product = await Product.create(data);

    revalidatePath("/dashboard");
    revalidatePath("/");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(product)),
    };
  } catch (error) {
    console.error("Error creating product:", error);

    // Handle specific MongoDB errors
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      return {
        success: false,
        error: "Product with this title already exists",
      };
    }

    return {
      success: false,
      error: "Failed to create product",
    };
  }
}

// Update product
export async function updateProduct(
  id: string,
  updates: Partial<{
    title: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    specs?: Record<string, string>;
    featured?: boolean;
  }>
) {
  const authCheck = await requireAdmin();
    if(!authCheck.success) {
      return { success: false, error: authCheck.error };
    }
  try {
    await connectDB();

    const updated = await Product.findByIdAndUpdate(id, updates, {
      new: true,
    }).lean();

    if (!updated) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    // Revalidate the products page
    revalidatePath("/products");
    revalidatePath("/");
    revalidatePath("/cart");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updated)),
    };
  } catch (error) {
    console.error("Error updating product:", error);

    // Handle specific MongoDB errors
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      return {
        success: false,
        error: "Product with this title already exists",
      };
    }

    return {
      success: false,
      error: "Failed to update product",
    };
  }
}

// Delete product
export async function deleteProduct(id: string) {
  try {
    const authCheck = await requireAdmin();
    if(!authCheck.success) {
      return { success: false, error: authCheck.error };
    }
    await connectDB();

    const deleted = await Product.findByIdAndDelete(id).lean();

    if (!deleted) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath("/");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(deleted)),
    };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      error: "Failed to delete product",
    };
  }
}
