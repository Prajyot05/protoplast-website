// stores/useProductStore.ts
import { create } from "zustand";
import { ProductType } from "@/models/Product";

interface ProductStore {
  productList: ProductType[];
  setProductList: (products: ProductType[]) => void;
  addToStore: (product: ProductType) => void;
  updateInStore: (product: ProductType) => void;
  removeFromStore: (id: string) => void;
  reduceStockForCart: (cartItems: { id: string; quantity: number }[]) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  productList: [],

  setProductList: (products) => set({ productList: products }),

  addToStore: (product) =>
    set((state) => ({
      productList: [...state.productList, product],
    })),

  updateInStore: (product) =>
    set((state) => ({
      productList: state.productList.map((p) =>
        p._id === product._id ? product : p
      ),
    })),

  removeFromStore: (id) =>
    set((state) => ({
      productList: state.productList.filter((p) => p._id !== id),
    })),

    reduceStockForCart: (cartItems) =>
    set((state) => ({
      productList: state.productList.map((product) => {
        const match = cartItems.find((c) => c.id === product._id);
        if (match) {
          // Clone with prototype to preserve methods and type
          return Object.assign(
            Object.create(Object.getPrototypeOf(product)),
            product,
            { stock: product.stock - match.quantity }
          );
        }
        return product;
      }),
    })),
}));


