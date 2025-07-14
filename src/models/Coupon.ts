import { Schema, model, models, Document } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  maxUses: number;
  expiresAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percent", "fixed"],
      required: true,
    },
    discountValue: { type: Number, required: true, min: 0 },
    maxUses: { type: Number, required: true, min: 1 },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: false }
);

// Prevent model overwrite errors in dev
const Coupon = models.Coupon || model<ICoupon>("Coupon", CouponSchema);
export default Coupon;
