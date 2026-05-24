import { Schema, model, models, Document } from "mongoose";

export interface ICourseBatch extends Document {
  courseType: "hardware" | "software";
  startDate: Date;
  endDate: Date;
  timing: string;
  maxSeats: number;
  currentRegistrations: number;
  price: number;
  status: "upcoming" | "active" | "full" | "completed";
  createdAt: Date;
}

const CourseBatchSchema = new Schema<ICourseBatch>(
  {
    courseType: { type: String, enum: ["hardware", "software"], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    timing: { type: String, required: true },
    maxSeats: { type: Number, required: true, default: 4 },
    currentRegistrations: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 4999 },
    status: {
      type: String,
      enum: ["upcoming", "active", "full", "completed"],
      required: true,
      default: "upcoming",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const CourseBatch = models.CourseBatch || model<ICourseBatch>("CourseBatch", CourseBatchSchema);
export default CourseBatch;
