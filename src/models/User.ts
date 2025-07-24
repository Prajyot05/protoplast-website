import { Schema, model, models } from "mongoose";

export interface IUser {
  clerkId: string;
  email: string;
  name: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Prevents model overwrite on hot reload
const User = models.User || model<IUser>("User", UserSchema);
export default User;
