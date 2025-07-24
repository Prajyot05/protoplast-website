// src/models/Transaction.ts
import { Schema, model, models, Document } from "mongoose";

export interface ITransaction extends Document {
  orderId:   string;
  paymentId: string;
  userId:    string;
  amount:    number;
  currency:  string;
  method:    string;
  status:    string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    orderId:   { type: String, required: true, index: true },
    paymentId: { type: String, required: true, unique: true },
    userId:    { type: String, required: true, index: true },
    amount:    { type: Number, required: true },
    currency:  { type: String, required: true },
    method:    { type: String, required: true },
    status:    { type: String, required: true },
    metadata:  { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);


const Transaction = models.Transaction || model<ITransaction>("Transaction", TransactionSchema);
export default Transaction;
