import { notFound } from "next/navigation"
import Header from "@/components/header"
import { getProductById } from "@/actions/products"
import type { ProductType } from "@/models/Product"
import ProductDetailsClient from "@/components/products/productDetailsClient"

interface PageProps {
  params: { productId: string }
}

export const metadata = {
  title: "Product Details",
}

export default async function ProductPage({ params }: PageProps) {
  const result = await getProductById(params.productId)
  if (!result.success || !result.data) notFound()

  const product: ProductType = result.data

  return (
    <>
      <Header />
      <ProductDetailsClient product={product} />
    </>
  )
}
