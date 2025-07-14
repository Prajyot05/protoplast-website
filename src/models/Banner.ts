import { Schema, model, models, Document } from "mongoose";

export interface IBanner extends Document {
  imageUrl: string;
  title: string;
  subtitle: string;
  link: string;
  active: boolean;
  order: number;
}

const BannerSchema = new Schema<IBanner>(
  {
    imageUrl: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    link: { type: String, required: true },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 }, // for sorting/display priority
  },
  { timestamps: false }
);

// Prevent model overwrite errors in dev
const Banner = models.Banner || model<IBanner>("Banner", BannerSchema);
export default Banner;
