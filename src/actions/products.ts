"use server";

import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

// Get all products
export async function getAllProducts() {
  await connectDB();
  // const products = await Product.find().populate("category");
  const products = await Product.find();
  return products;
}

// Get one product
export async function getProductById(id: string) {
  await connectDB();
  const product = await Product.findById(id).populate("category");
  if (!product) throw new Error("Product not found");
  return product;
}

// Create product
export async function createProduct(data: {
  title: string;
  description: string;
  price: number;
  stock: number;
  category?: string;
  images: string[];
  specs?: Record<string, string>;
  featured?: boolean;
}) {
  await connectDB();
  console.log("DATA BEING SENT: ", data);
  const product = await Product.create(data);
  return product;
}

// Update product
export async function updateProduct(
  id: string,
  updates: Partial<{
    title: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    images: string[];
    specs?: Record<string, string>;
    featured?: boolean;
  }>
) {
  await connectDB();
  const updated = await Product.findByIdAndUpdate(id, updates, { new: true });
  return updated;
}

// Delete product
export async function deleteProduct(id: string) {
  await connectDB();
  const deleted = await Product.findByIdAndDelete(id);
  return deleted;
}
