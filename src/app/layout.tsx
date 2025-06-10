import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { BlogProvider } from "@/context/blog-context";
import { ToastProvider } from "@/context/toast-context";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ToastContainer from "@/components/ui/toast-container";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BlogSpace - Share Your Stories",
  description: "A modern blogging platform for writers and readers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <AuthProvider>
            <BlogProvider>
              <div className="min-h-screen flex flex-col bg-gray-50">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <ToastContainer />
            </BlogProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
