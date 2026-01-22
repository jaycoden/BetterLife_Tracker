import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LocalAuthProvider } from "@/lib/hooks/useLocalAuth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Jayden's Life OS",
  description: "Personal productivity and life tracking system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <LocalAuthProvider>
          {children}
        </LocalAuthProvider>
      </body>
    </html>
  );
}
