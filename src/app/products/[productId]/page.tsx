import { notFound } from "next/navigation"
import Header from "@/components/header"
import { getProductById } from "@/actions/products"
import type { ProductType } from "@/models/Product"
import ProductDetailsClient from "@/components/products/productDetailsClient"
import { Metadata } from "next"

interface PageProps {
  params: Promise<{ productId: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { productId } = await params;
  const result = await getProductById(productId);
  
  if (!result.success || !result.data) {
    return {
      title: "Product Not Found | Protoplast",
    }
  }

  return {
    title: `${result.data.title} | Protoplast`,
    description: result.data.description,
  }
}

export default async function ProductPage(props: PageProps) {
  // Await params for Next.js 15
  const params = await props.params; 
  const result = await getProductById(params.productId);
  
  if (!result.success || !result.data) notFound();

  const product: ProductType = result.data;

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <ProductDetailsClient product={product} />
    </main>
  );
}
