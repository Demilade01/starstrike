import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StarStrike: Cosmic Mining Consortium",
  description: "A 3D blockchain-powered space mining game built with Honeycomb Protocol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black overflow-hidden">
        {children}
      </body>
    </html>
  );
}
