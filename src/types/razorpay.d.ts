declare namespace Razorpay {
  type CurrencyCode = "INR" | "USD" | "EUR" | string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: Razorpay.CurrencyCode;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  retry?: {
    enabled?: boolean;
    max_count?: number;
  };
  remember_customer?: boolean;
  readonly?: {
    email?: boolean;
    contact?: boolean;
    name?: boolean;
  };
}

declare class Razorpay {
  constructor(options: RazorpayOptions);
  on(event: string, callback: (response: any) => void): void;
  open(): void;
}