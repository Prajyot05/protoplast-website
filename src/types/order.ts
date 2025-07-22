export interface OrderProduct {
  product: {
    _id: string
    title: string
    price: number
    images?: string[]
  }
  quantity: number
  priceAtPurchase: number
}

export interface OrderAddress {
  _id: string
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  type: "shipping" | "billing"
}

export interface OrderType {
  _id: string
  user: string
  address: OrderAddress
  products: OrderProduct[]
  totalAmount: number
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
  paymentIntentId: string
  createdAt: string
}
