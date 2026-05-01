// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "LandingCraft — Build Landing Pages in Minutes",
    description:
        "The fastest way to create high-converting landing pages for your business.",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <Toaster position="top-right" />
        {children}
        </body>
        </html>
    );
}