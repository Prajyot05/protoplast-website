import { Schema, model, models, Document, Types } from "mongoose";
import { IAddress } from "./Address";

interface OrderedProduct {
  product: Types.ObjectId;
  quantity: number;
  priceAtPurchase: number;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  address: Types.ObjectId | IAddress;
  products: OrderedProduct[];
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  paymentIntentId: string;
  createdAt: Date;
}

const OrderedProductSchema = new Schema<OrderedProduct>(
  {
    product:         { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity:        { type: Number, required: true },
    priceAtPurchase: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    user:            { type: Schema.Types.ObjectId, ref: "User", required: true },
    address:         { type: Schema.Types.ObjectId, ref: "Address", required: true },
    products:        { type: [OrderedProductSchema], required: true },
    totalAmount:     { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentIntentId: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Order = models.Order || model<IOrder>("Order", OrderSchema);
export default Order;
