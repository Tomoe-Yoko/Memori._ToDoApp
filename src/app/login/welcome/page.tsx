"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

import { useUser } from "@/app/_hooks/useUser";

// interface LoginUserData {
//   userName: string;
//   themeColor: string;
// }

const WelcomePage: React.FC = () => {
  const { token } = useSupabaseSession();
  const { userName, isLoading } = useUser();
  const router = useRouter();

  // const getThemeColor = (themeColorId: string): string => {
  //   return themeColors[themeColorId] || "#E4C8CE"; // デフォルトカラー
  // };

  useEffect(() => {
    if (isLoading) return;
    // タイマーを設定して1.8秒後にページ遷移
    const timer = setTimeout(() => {
      router.push("/calendar");
    }, 1800);

    return () => clearTimeout(timer);
  }, [router, token, isLoading]);

  return (
    <div className="relative max-w-md min-h-svh m-auto">
      <div className="absolute inset-0 w-full h-screen bg-tether-line bg-no-repeat bg-right flex justify-center items-center text-white animate-fadeout">
        <p className="text-center tracking-tight mt-[-10rem] text-[1.5rem]">
          {userName}さん
          <br />
          今日もおつかれさま
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;
