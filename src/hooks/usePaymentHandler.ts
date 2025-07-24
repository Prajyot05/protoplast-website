// hooks/usePaymentHandler.ts
"use client";

import { useLocalProduct } from "@/stores/useLocalProduct";
import { useProductStore } from "@/stores/useProductStore";
import { handlePaymentSuccess } from "@/actions/razorpay";
import { toast } from "sonner";

interface PaymentResult {
  success: boolean;
  error?: string;
  message?: string;
  updatedProducts?: any[];
}

export const usePaymentHandler = () => {
  const { cart, clearCart } = useLocalProduct();
  const { updateInStore } = useProductStore();

  /**
   * Called after a successful Razorpay payment.
   * - Reduces stock via server action
   * - Updates Zustand store with new product data
   * - Clears the user's cart
   */
  const processPaymentSuccess = async (
    paymentInfo: any,
    userId: string
  ): Promise<PaymentResult> => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return { success: false, error: "Cart is empty" };
    }

    // Prepare payload for server action
    const cartItems = cart.map(item => ({
      productId: item._id,
      quantity: item.quantity,
    }));

    try {
      // Call the server action to handle payment success & stock update
      const result = await handlePaymentSuccess({
        userId,
        cartItems,
        paymentInfo,
      });

      if (!result.success) {
        toast.error(result.error || "Failed to update stock");
        return { success: false, error: result.error };
      }

      // Write each updated product back into Zustand store
      result.updatedProducts?.forEach((prod: any) => {
        updateInStore(prod);
      });

      // Clear the cart
      clearCart();
      toast.success("Payment successful! Stock updated and cart cleared.");

      return {
        success: true,
        message: "Payment processed successfully",
        updatedProducts: result.updatedProducts,
      };
    } catch (err: any) {
      console.error("Payment processing error:", err);
      toast.error("An error occurred during payment processing");
      return { success: false, error: err.message || "Payment processing failed" };
    }
  };

  /**
   * Optional helper to validate that cart quantities do not exceed current stock.
   * Can be called before initiating payment.
   */
  const validateStockAvailability = (): boolean => {
    const outOfStock = cart.filter(cartItem => {
      const prod = useProductStore.getState().productList.find(p => p._id === cartItem._id);
      return prod && prod.stock < cartItem.quantity;
    });
    if (outOfStock.length > 0) {
      const names = outOfStock.map(i => i.title).join(", ");
      toast.error(`Insufficient stock for: ${names}`);
      return false;
    }
    return true;
  };

  /**
   * Returns summary of current cart: item count and total price.
   */
  const getCartSummary = () => {
    const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
    const totalAmount = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return { totalItems, totalAmount };
  };

  return {
    processPaymentSuccess,
    validateStockAvailability,
    getCartSummary,
  };
};
