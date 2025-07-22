import { Schema, model, models, type Document } from "mongoose";

export interface IAddress extends Document {
  user: string; // Changed from Types.ObjectId to string
  type: "shipping" | "billing";
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  createdAt: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    user: { type: String, required: true }, // Changed from Schema.Types.ObjectId to String
    type: {
      type: String,
      enum: ["shipping", "billing"],
      required: true,
    },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Address = models.Address || model<IAddress>("Address", AddressSchema);
export default Address;
