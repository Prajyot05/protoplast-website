import {
  Schema,
  model,
  models,
  Document,
} from "mongoose";

export interface IProduct extends Document {
  title: string;
  description?: string;
  price: number;
  stock: number;
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
    images: [{ type: String }],
    specs: { type: Map, of: String },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = models.Product || model<IProduct>("Product", ProductSchema);

export type ProductType = {
  _id: string;
  title: string;
  description?: string;
  price: number;
  stock: number;
  images: string[];
  specs?: Record<string, string>;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

export default Product;
