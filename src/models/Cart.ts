import { Schema, model, models, Document, Types } from "mongoose";

interface CartItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  user: Types.ObjectId;
  items: CartItem[];
  updatedAt: Date;
}

const CartItemSchema = new Schema<CartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false } // Avoids nested _id inside each item
);

const CartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: { type: [CartItemSchema], default: [] },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

// Prevent model overwrite errors in dev
const Cart = models.Cart || model<ICart>("Cart", CartSchema);
export default Cart;
