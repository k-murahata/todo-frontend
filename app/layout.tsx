import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TODO アプリ",
  description: "Next.js で作成した TODO リストアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
