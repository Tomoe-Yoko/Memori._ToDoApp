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
    "/reset_password/send_email",
    "/reset_password/setting_pass",
  ];
  const isDefaultBackground = defaultBackgroundPaths.includes(passName); // ここに影響を受けたくないパスを追加

  return (
    <html lang="ja">
      <Head>
        <title>Memori Todo App</title>
        <meta name="description" content="todoアプリで快適な生活を" />
        {/* ファビコン関連 */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
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
