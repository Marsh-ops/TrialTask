import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer"
import { CartProvider } from "@/components/CartContext";

export const metadata: Metadata = {
  title: "Anderson",
  description: "Anderson Trial Task",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <CartProvider>
        <Header />
          {children}  
        <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
