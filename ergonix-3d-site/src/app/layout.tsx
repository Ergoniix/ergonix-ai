import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ergonix — Digital Engineering",
  description: "Modern web experiences, software systems and digital engineering.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
