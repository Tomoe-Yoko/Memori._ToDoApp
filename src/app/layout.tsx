"use client";
// import Head from "next/head";

// import type { Metadata } from "next";
// import { Jost } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import { useUser } from "./_hooks/useUser";
import { useSupabaseSession } from "./_hooks/useSupabaseSession";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// const jost = Jost({
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Memori Todo App",
//   description: "todoアプリで快適な生活を",
// };
// フェッチャー関数を定義します。fetchを使ってデータを取得します。
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { themeColor, mutate } = useUser();
  const { session } = useSupabaseSession();
  const router = useRouter();
  useEffect(() => {
    if (!session) return;
    mutate();
    router.push("/calendar");
  }, [session, mutate, router]);
  console.log(themeColor);

  return (
    <html lang="ja">
      <body className={themeColor}>
        <div className="max-w-[500px] min-h-svh m-auto border-r border-l border-white">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
