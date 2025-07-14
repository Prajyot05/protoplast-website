import { Schema, model, models, Document, Types } from "mongoose";

export interface IAuditLog extends Document {
  action: string;
  admin: Types.ObjectId;
  target?: Types.ObjectId;
  description?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true }, // e.g., "create_product", "delete_user"
    admin: { type: Schema.Types.ObjectId, ref: "User", required: true }, // must be an admin
    target: { type: Schema.Types.ObjectId, required: false }, // optional: any affected document
    description: { type: String }, // optional extra context
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Prevent model overwrite errors in dev
const AuditLog =
  models.AuditLog || model<IAuditLog>("AuditLog", AuditLogSchema);
export default AuditLog;
