import React from "react";
import type { OrderType } from "@/types/order";

interface InvoiceTemplateProps {
  order: OrderType;
  downloadDate: string;
}

export const InvoiceTemplate = React.forwardRef<HTMLDivElement, InvoiceTemplateProps>(
  ({ order, downloadDate }, ref) => {
    return (
      <div
        ref={ref}
        className="p-12 w-[800px] min-h-[1000px] relative flex flex-col"
        style={{ 
          fontFamily: "var(--font-inter), sans-serif",
          backgroundColor: "#ffffff",
          color: "#000000"
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-16">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <img src="/logo-full-black.svg" alt="Protoplast Logo" className="h-12 w-auto" />
              <div style={{ width: "2px", height: "40px", backgroundColor: "#e5e7eb" }} />
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tighter leading-none">Protoplast</span>
                <span className="text-2xl font-bold tracking-tighter leading-none text-green-600">Studios</span>
              </div>
            </div>
            <p className="text-sm font-medium tracking-widest uppercase" style={{ color: "#6b7280" }}>
              High-Precision Manufacturing Solutions
            </p>
          </div>
          <div className="text-right">
            <h1 className="text-6xl font-bold tracking-tighter mb-2">INVOICE</h1>
            <p className="text-sm uppercase tracking-widest" style={{ color: "#9ca3af" }}>
              Downloaded on {downloadDate}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-20 mb-16">
          {/* Bill To */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: "#9ca3af" }}>
              Bill To
            </p>
            <h2 className="text-2xl font-bold mb-2">{order.address.fullName}</h2>
            <div className="leading-relaxed" style={{ color: "#6b7280" }}>
              <p>{order.address.street}</p>
              <p>
                {order.address.city}, {order.address.state} {order.address.zip}
              </p>
              <p>{order.address.country}</p>
              <p className="mt-2 font-medium" style={{ color: "#000000" }}>
                {order.address.phone}
              </p>
            </div>
          </div>

          {/* Order Info */}
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: "#9ca3af" }}>
              Order Details
            </p>
            <div className="flex flex-col items-end space-y-3">
              <div className="flex items-center gap-6">
                <span className="uppercase text-[10px] font-bold tracking-widest" style={{ color: "#9ca3af" }}>Date</span>
                <span className="font-medium text-lg text-black min-w-[100px]">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="uppercase text-[10px] font-bold tracking-widest" style={{ color: "#9ca3af" }}>Status</span>
                <span className="font-bold uppercase text-lg min-w-[100px]" style={{ color: "#16a34a" }}>{order.status}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="uppercase text-[10px] font-bold tracking-widest" style={{ color: "#9ca3af" }}>Payment</span>
                <span className="font-medium text-lg text-black min-w-[100px]">Razorpay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mb-16">
          <div className="grid grid-cols-12 border-b-2 pb-4 mb-6" style={{ borderBottomColor: "#000000", borderTopColor: "transparent", borderLeftColor: "transparent", borderRightColor: "transparent" }}>
            <div className="col-span-6 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#9ca3af" }}>
              Item Description
            </div>
            <div className="col-span-2 text-center text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#9ca3af" }}>
              Qty
            </div>
            <div className="col-span-2 text-right text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#9ca3af" }}>
              Price
            </div>
            <div className="col-span-2 text-right text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#9ca3af" }}>
              Total
            </div>
          </div>

          <div className="space-y-6">
            {order.products.map((item, index) => (
              <div key={index} className="grid grid-cols-12 items-center">
                <div className="col-span-6">
                  <h3 className="text-xl font-bold" style={{ color: "#000000" }}>{item.product.title}</h3>
                  <p className="text-sm line-clamp-1" style={{ color: "#9ca3af" }}>{item.product.description}</p>
                </div>
                <div className="col-span-2 text-center font-medium text-lg" style={{ color: "#000000" }}>
                  {item.quantity}
                </div>
                <div className="col-span-2 text-right font-medium text-lg" style={{ color: "#000000" }}>
                  ₹{item.priceAtPurchase.toLocaleString()}
                </div>
                <div className="col-span-2 text-right font-bold text-lg" style={{ color: "#000000" }}>
                  ₹{(item.priceAtPurchase * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="flex justify-end mb-32">
          <div className="w-80 space-y-4">
            <div className="flex justify-between text-lg" style={{ color: "#6b7280" }}>
              <span>Subtotal</span>
              <span>₹{order.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg" style={{ color: "#6b7280" }}>
              <span>Shipping</span>
              <span className="font-medium" style={{ color: "#16a34a" }}>Free</span>
            </div>
            <div className="pt-8 border-t-2 flex justify-between items-center" style={{ borderTopColor: "#000000", borderBottomColor: "transparent", borderLeftColor: "transparent", borderRightColor: "transparent" }}>
              <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "#000000" }}>Total Amount</span>
              <span className="text-5xl font-bold tracking-tighter leading-none" style={{ color: "#000000" }}>
                ₹{order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8 border-t flex justify-between items-center" style={{ borderTopColor: "#f3f4f6", borderBottomColor: "transparent", borderLeftColor: "transparent", borderRightColor: "transparent" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#9ca3af" }}>
            Thank you for choosing Protoplast Studio
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#9ca3af" }}>
            protoplast.in
          </p>
        </div>
      </div>
    );
  }
);

InvoiceTemplate.displayName = "InvoiceTemplate";
