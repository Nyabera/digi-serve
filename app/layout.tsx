import "@fontsource-variable/inter";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/source-code-pro";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";








/* Local font compatibility objects. */
const plusJakartaSans = {
  variable: "font-plus-jakarta-sans",
  className: "font-plus-jakarta-sans",
  style: {
    fontFamily: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", sans-serif',
  },
} as const;

const inter = {
  variable: "font-inter",
  className: "font-inter",
  style: {
    fontFamily: '"Inter Variable", Inter, sans-serif',
  },
} as const;

const sourceCodePro = {
  variable: "font-source-code-pro",
  className: "font-source-code-pro",
  style: {
    fontFamily: '"Source Code Pro Variable", "Source Code Pro", monospace',
  },
} as const;
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