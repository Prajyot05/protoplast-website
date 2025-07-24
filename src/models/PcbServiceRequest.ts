import { Schema, model, models, Document, Types } from "mongoose";

export interface IPcbServiceRequest extends Document {
  user: Types.ObjectId;
  uploadedFile: Types.ObjectId;
  layers: "1" | "2";
  dimensions: {
    length_mm: number;
    width_mm: number;
  };
  quantity: number;
  boardType: "Single" | "Panel";
  material: "FR-4";
  solderMask: "Green" | "Red" | "Yellow" | "Blue" | "White" | "Black";
  silkscreen: "White" | "Black";
  surfaceFinish: "HASL with lead" | "Lead-Free HASL" | "ENIG";
  copperWeight: "1 oz" | "2 oz";
  instructions?: string;
  quote: number;
  createdAt: Date;
}

const PcbServiceRequestSchema = new Schema<IPcbServiceRequest>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    uploadedFile: { type: Schema.Types.ObjectId, ref: "File", required: true },
    layers: { type: String, enum: ["1", "2"], required: true },
    dimensions: {
      length_mm: {
        type: Number,
        required: true,
        max: 152.4, // 6 inches
      },
      width_mm: {
        type: Number,
        required: true,
        max: 127.0, // 5 inches
      },
    },
    quantity: { type: Number, required: true, min: 1 },
    boardType: { type: String, enum: ["Single", "Panel"], required: true },
    material: { type: String, enum: ["FR-4"], required: true },
    solderMask: {
      type: String,
      enum: ["Green", "Red", "Yellow", "Blue", "White", "Black"],
      required: true,
    },
    silkscreen: { type: String, enum: ["White", "Black"], required: true },
    surfaceFinish: {
      type: String,
      enum: ["HASL with lead", "Lead-Free HASL", "ENIG"],
      required: true,
    },
    copperWeight: {
      type: String,
      enum: ["1 oz", "2 oz"],
      required: true,
    },
    instructions: { type: String },
    quote: { type: Number, required: true, min: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Prevent model overwrite errors in dev
const PcbServiceRequest =
  models.PcbServiceRequest ||
  model<IPcbServiceRequest>("PcbServiceRequest", PcbServiceRequestSchema);

export default PcbServiceRequest;
