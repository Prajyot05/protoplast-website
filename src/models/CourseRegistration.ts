import { Schema, model, models, Document, Types } from "mongoose";

export interface ICourseRegistration extends Document {
  user?: string; // Clerk user ID
  
  // Personal Info
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  fullAddress: string;

  // Contact Info
  mobile: string;
  email: string;
  emergencyName: string;
  emergencyNumber: string;
  emergencyRelation: string;

  // Academic Background
  college: string;
  degree: string;
  branch: string;
  currentYear: string;
  cgpa: string;
  graduationYear: number;

  // Track Selection
  batchId: Types.ObjectId | string;

  // Experience & Skills
  priorExperience: string;
  relevantSkills: string;
  ownLaptop: "yes" | "no";

  // Motivation
  referralSource: string;
  motivation: string;
  questions: string;

  // Payment Info
  amount: number;
  paymentStatus: "pending" | "paid" | "failed";
  paymentIntentId: string;
  
  createdAt: Date;
}

const CourseRegistrationSchema = new Schema<ICourseRegistration>(
  {
    user: { type: String, required: false },

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true },
    fullAddress: { type: String, required: true },

    mobile: { type: String, required: true },
    email: { type: String, required: true },
    emergencyName: { type: String, required: true },
    emergencyNumber: { type: String, required: true },
    emergencyRelation: { type: String, required: true },

    college: { type: String, required: true },
    degree: { type: String, required: true },
    branch: { type: String, required: true },
    currentYear: { type: String, required: true },
    cgpa: { type: String, required: false },
    graduationYear: { type: Number, required: true },

    batchId: { type: Schema.Types.ObjectId, ref: "CourseBatch", required: true },

    priorExperience: { type: String, required: true },
    relevantSkills: { type: String, required: false },
    ownLaptop: { type: String, enum: ["yes", "no"], required: true },

    referralSource: { type: String, required: true },
    motivation: { type: String, required: true },
    questions: { type: String, required: false },

    amount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentIntentId: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const CourseRegistration = models.CourseRegistration || model<ICourseRegistration>("CourseRegistration", CourseRegistrationSchema);
export default CourseRegistration;
