// transaction.ts
export interface TransactionType {
  fee?: number | null;
  type?: string; // It's a simple string from the backend, not a ReactNode
  referenceNumber?: string | null;
  receiver?: string | null; // Backend data may not send receiver/sender, so may be null
  sender?: string | null;
  _id: string;
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  metadata: {
    contact?: string;
    email?: string;
    vpa?: string;
    fee?: number;
    [key: string]: any;
  };
}
