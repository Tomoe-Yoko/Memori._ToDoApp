import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";

const jost = Jost({
  subsets: ["latin"],
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
      <body className={`${jost} bg-001`}>
        <div className="max-w-[500px] min-h-svh m-auto border-r border-l border-white">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
