// import mongoose, { Schema, model, models, Document } from "mongoose";

// export interface ICategory extends Document {
//   name: string;
//   slug: string;
//   description?: string;
// }

// const CategorySchema = new Schema<ICategory>(
//   {
//     name: { type: String, required: true, unique: true },
//     slug: { type: String, required: true, unique: true },
//     description: { type: String },
//   },
//   { timestamps: false }
// );

// // Prevent model overwrite errors in dev
// const Category =
//   models.Category || model<ICategory>("Category", CategorySchema);
// export default Category;


