import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AnimatedCursor from "react-animated-cursor";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Protoplast Studio",
  description:
    "Your one-stop solution for advanced manufacturing. We provide top-quality services to bring your ideas to life with precision and efficiency. Click buttons above for details.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          id="top"
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          suppressHydrationWarning
        >
          <AnimatedCursor
            innerSize={10}
            outerSize={45}
            color="255, 0, 255"
            outerAlpha={0.4}
            innerScale={1.5}
            outerScale={2}
            outerStyle={{
              mixBlendMode: "exclusion",
            }}
            clickables={["a", "button", "input", "select", "textarea"]}
          />

          <Toaster
            theme="dark"
            toastOptions={{
              className:
                "bg-black border border-green-500 text-white rounded-md shadow-lg transition-all duration-700 ease-in-out",
              style: {
                backgroundColor: "#000000",
                borderColor: "#22c55e",
                color: "#ffffff",
                boxShadow: "0 4px 12px rgba(0, 255, 0, 0.3)",
                borderRadius: "8px",
                transition: "all 0.7s ease-in-out",
              },
            }}
            richColors
            closeButton
          />

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
