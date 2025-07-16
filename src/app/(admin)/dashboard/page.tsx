import { getAllProducts } from "@/actions/products";
import CreateProduct from "./create-product";
import Image from "next/image";
import ShowAllProducts from "@/components/products/showAllProducts";

export default async function AdminDashboard() {
  const products = await getAllProducts();

  return (
    <div className="text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <CreateProduct />
      <ShowAllProducts products={products} isAdmin={true} />

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">All Products</h2>
      </div>
    </div>
  );
}
