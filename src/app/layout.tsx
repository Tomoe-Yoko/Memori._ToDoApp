"use client";
import Head from "next/head";
import { Jost } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import { useUser } from "./_hooks/useUser";
import { usePathname } from "next/navigation";

const jost = Jost({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { themeColor } = useUser();

  const passName = usePathname();
  // useUserに影響されたくない背景色の設定
  const defaultBackgroundColor = "bg-Theme01"; // デフォルトの背景色を指定
  const defaultBackgroundPaths = [
    "/",
    "/login",
    "/signup",
    "/resetPassword/sendEmail",
    "/resetPassword/settingPass",
  ];
  const isDefaultBackground = defaultBackgroundPaths.includes(passName); // ここに影響を受けたくないパスを追加

  return (
    <html lang="ja">
      <Head>
        <title>Memori Todo App</title>
        <meta name="description" content="todoアプリで快適な生活を" />
      </Head>
      <body
        className={`${jost.className} ${
          isDefaultBackground ? defaultBackgroundColor : themeColor
        }`}
      >
        <div className="max-w-[500px] min-h-svh m-auto border-r border-l border-white">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
