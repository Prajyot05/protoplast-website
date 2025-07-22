import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ProductType } from "@/models/Product"

type CartProduct = Omit<ProductType, keyof import("mongoose").Document> & {
  _id: string
  quantity: number
}

interface CartStore {
  cart: CartProduct[]
  addToCart: (product: ProductType, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useLocalProduct = create(
  persist<CartStore>(
    (set, get) => ({
      cart: [],

      addToCart: (product, quantity) => {
        const cart = get().cart
        const existingIndex = cart.findIndex((p) => p._id === product._id)
        let updatedCart: CartProduct[]

        if (existingIndex !== -1) {
          updatedCart = [...cart]
          updatedCart[existingIndex].quantity += quantity
        } else {
          // Convert product to plain object to avoid Mongoose instance issues
          const plainProduct = JSON.parse(JSON.stringify(product)) as ProductType
          updatedCart = [...cart, { ...plainProduct, _id: String(plainProduct._id), quantity }]
        }
        set({ cart: updatedCart as CartProduct[] })
      },

      removeFromCart: (productId) => {
        const cart = get().cart
        const updatedCart = cart.filter((item) => item._id !== productId)
        set({ cart: updatedCart })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId)
          return
        }

        const cart = get().cart
        const updatedCart = cart.map((item) => (item._id === productId ? { ...item, quantity } : item))
        set({ cart: updatedCart })
      },

      clearCart: () => {
        set({ cart: [] })
      },

      getTotalItems: () => {
        const cart = get().cart
        return cart.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        const cart = get().cart
        return cart.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: "local-cart-storage",
    },
  ),
)
