import { create } from "zustand";
import { ProductType } from "@/models/Product";


interface ProductStore {
  productList: ProductType[];
  setProductList: (products: ProductType[]) => void;
  addToStore: (product: ProductType) => void;
  updateInStore: (product: ProductType) => void;
  removeFromStore: (id: string) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  productList: [],

  setProductList: (products) => set({ productList: products }),

  addToStore: (product) =>
    set((state) => ({
      productList: [...state.productList, product],
    })),

  updateInStore: (product) =>
    set((state) => {
      const index = state.productList.findIndex((p) => p._id === product._id);
      if (index !== -1) {
        const updated = [...state.productList];
        updated[index] = product;
        return { productList: updated };
      } else {
        return { productList: [...state.productList, product] };
      }
    }),

  removeFromStore: (id) =>
    set((state) => ({
      productList: state.productList.filter((p) => p._id !== id),
    })),
}));