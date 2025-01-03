"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { themeColors } from "@/app/_type/login";

// interface LoginUserData {
//   userName: string;
//   themeColor: string;
// }

const WelcomePage: React.FC = () => {
  const { token } = useSupabaseSession();
  const [userName, setUserName] = useState<string>("ユーザー");
  const [themeColor, setThemeColor] = useState<string | null>("#E4C8CE");
  const router = useRouter();

  const getThemeColor = (themeColorId: string): string => {
    return themeColors[themeColorId] || "#E4C8CE"; // デフォルトカラー
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      try {
        const response = await fetch("/api/login", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(
            "ユーザーデータの取得に失敗しました: ",
            errorData.message
          );
          return;
        }

        const result = await response.json();
        const { userName, themeColor } = result.userData; // userDataを展開

        // ユーザー名とテーマカラーをステートに設定
        setUserName(userName || "ユーザー");
        setThemeColor(getThemeColor(themeColor));
      } catch (error) {
        console.error("APIリクエスト中にエラーが発生しました: ", error);
      }
    };

    fetchUserData();

    // タイマーを設定して1.8秒後にページ遷移
    const timer = setTimeout(() => {
      router.push("/calendar");
    }, 1800);

    return () => clearTimeout(timer);
  }, [router, token]);

  useEffect(() => {
    // テーマカラーを背景色に適用
    if (themeColor) {
      document.body.style.backgroundColor = themeColor;
    }
  }, [themeColor]);

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
