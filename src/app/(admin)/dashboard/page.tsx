import { getAllProducts } from "@/actions/products";
import CreateProduct from "@/components/products/create-product";
import ShowAllProducts from "@/components/products/showAllProducts";

export default async function AdminDashboard() {
  const result = await getAllProducts();
  const products = result.success ? result.data : [];

  return (
    <div className="text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <CreateProduct />
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">All Products</h2>
        <ShowAllProducts products={products} isAdmin={true} />
        {!result.success && (
          <div className="text-red-500 mt-2">Failed to load products: {result.error}</div>
        )}
      </div>
    </div>
  );
}
