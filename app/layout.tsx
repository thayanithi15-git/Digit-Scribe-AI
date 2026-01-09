import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AICharbot from "@/components/chatbot";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "DigitScribe AI - Advanced Text Recognition",
  description:
    "An AI-powered application that recognizes handwritten digits, text, and documents using deep learning. Experience cutting-edge OCR technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${poppins.className} bg-white antialiased overflow-x-hidden`}>
        {children}
        <AICharbot />
      </body>
    </html>
  );
}