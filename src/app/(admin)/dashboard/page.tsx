import { getAllProducts } from "@/actions/products";
import CreateProduct from "./create-product";
import Image from "next/image";

export default async function AdminDashboard() {
  const products = await getAllProducts();

  return (
    <div className="text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <CreateProduct />

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">All Products</h2>
        {products.length === 0 ? (
          <p className="text-muted-foreground">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <div
                key={product._id}
                className="bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden shadow-md"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4 space-y-1">
                  <h3 className="text-lg font-semibold">{product.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-green-400 font-medium mt-1">
                    ₹{product.price}
                  </p>
                  <div className="text-xs text-gray-400">
                    Stock: {product.stock}
                  </div>
                  <div className="text-xs text-gray-400">
                    Category: {product.category?.name || "Uncategorized"}
                  </div>

                  {product.featured && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs bg-amber-500 text-black rounded-full font-medium">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
