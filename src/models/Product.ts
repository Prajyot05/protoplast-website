import {
  Schema,
  model,
  models,
  Document,
  Types,
  InferSchemaType,
} from "mongoose";

export interface IProduct extends Document {
  title: string;
  description?: string;
  price: number;
  stock: number;
  // category?: Types.ObjectId;
  images: string[];
  specs?: Record<string, string>;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    // category: { type: Schema.Types.ObjectId, ref: "Category" },
    images: [{ type: String }],
    specs: { type: Map, of: String },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevent model overwrite error during development
const Product = models.Product || model<IProduct>("Product", ProductSchema);
export type ProductType = InferSchemaType<typeof ProductSchema>;

export default Product;
