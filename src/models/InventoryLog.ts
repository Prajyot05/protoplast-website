import { Schema, model, models, Document, Types } from "mongoose";

export interface IInventoryLog extends Document {
  product: Types.ObjectId;
  change: number; // positive or negative
  reason: string;
  admin: Types.ObjectId;
  createdAt: Date;
}

const InventoryLogSchema = new Schema<IInventoryLog>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    change: { type: Number, required: true }, // e.g., +10 or -3
    reason: { type: String, required: true },
    admin: { type: Schema.Types.ObjectId, ref: "User", required: true }, // must be an admin
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Prevent model overwrite errors in dev
const InventoryLog =
  models.InventoryLog ||
  model<IInventoryLog>("InventoryLog", InventoryLogSchema);
export default InventoryLog;
