import { Schema, model, models, Document, Types } from "mongoose";

export interface IPrintingServiceRequest extends Document {
  user: Types.ObjectId;
  uploadedFile: Types.ObjectId;
  material: "PLA" | "ABS" | "PETG" | "TPU/TPE (FLEXIBLE)";
  quality: number; // 0.15 to 0.4 mm
  infill: number; // percentage (0–100)
  color: string;
  quantity: number;
  instructions?: string;
  quote: number;
  createdAt: Date;
}

const PrintingServiceRequestSchema = new Schema<IPrintingServiceRequest>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    uploadedFile: { type: Schema.Types.ObjectId, ref: "File", required: true },
    material: {
      type: String,
      enum: ["PLA", "ABS", "PETG", "TPU/TPE (FLEXIBLE)"],
      required: true,
    },
    quality: {
      type: Number,
      required: true,
      min: 0.15,
      max: 0.4,
    },
    infill: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    color: { type: String, required: true }, // e.g., "black", "orange", "white"
    quantity: { type: Number, required: true, min: 1 },
    instructions: { type: String },
    quote: { type: Number, required: true, min: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Prevent model overwrite errors in dev
const PrintingServiceRequest =
  models.PrintingServiceRequest ||
  model<IPrintingServiceRequest>(
    "PrintingServiceRequest",
    PrintingServiceRequestSchema
  );

export default PrintingServiceRequest;
