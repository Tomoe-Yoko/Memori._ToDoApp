"use client";
// import type { Metadata } from "next";
// import { Jost } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import { ThemeProvider, ThemeContext } from "./_context/ThemeContext";
import { useContext } from "react";
import { themeColors } from "./_type/login";
// const jost = Jost({
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Memori Todo App",
//   description: "todoアプリで快適な生活を",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { themeColor } = useContext(ThemeContext);
  return (
    <html lang="ja">
      <ThemeProvider>
        <body style={{ backgroundColor: themeColors[themeColor] }}>
          <div className="max-w-[500px] min-h-svh m-auto border-r border-l border-white">
            <Header />
            {children}
          </div>
        </body>
      </ThemeProvider>
    </html>
  );
}
