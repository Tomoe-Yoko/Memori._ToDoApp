"use client";
import Head from "next/head";
import { Jost } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import { useUser } from "./_hooks/useUser";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseSession } from "./_hooks/useSupabaseSession";

const jost = Jost({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { themeColor, mutate } = useUser();
  const { token } = useSupabaseSession();
  const router = useRouter();
  useEffect(() => {
    if (!token) return;
    mutate();
    router.push("/calendar");
  }, [token, mutate, router]);

  return (
    <html lang="ja">
      <Head>
        <title>Memori Todo App</title>
        <meta name="description" content="todoアプリで快適な生活を" />
      </Head>
      <body className={`${jost.className} ${themeColor}`}>
        <div className="max-w-[500px] min-h-svh m-auto border-r border-l border-white">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
