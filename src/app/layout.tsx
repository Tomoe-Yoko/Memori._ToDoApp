import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
const JostFont = Jost({
  weight: "400",
  subsets: ["latin"],
  variable: "--Jost",
});

export const metadata: Metadata = {
  title: "Memori Todo App",
  description: "todoアプリで快適な生活を",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${JostFont.variable} bg-001`}>
        <div className="max-w-md bg-001 m-auto border-r border-l border-white">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
