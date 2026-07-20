import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Inter,
  Plus_Jakarta_Sans,
  Source_Code_Pro,
} from "next/font/google";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-plus-jakarta-sans",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-source-code-pro",
});

export const metadata: Metadata = {
  title: {
    default: "FAIDIA",
    template: "%s | FAIDIA",
  },
  description:
    "A service operations platform for institutional requests, approvals, documents, workflows and verification.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={[
        plusJakartaSans.className,
        plusJakartaSans.variable,
        inter.variable,
        sourceCodePro.variable,
      ].join(" ")}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}