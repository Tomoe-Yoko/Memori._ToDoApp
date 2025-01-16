"use client";
import { ThemeColor, themeColors } from "@/app/_type/login";
import { $Enums } from "@prisma/client";
import React, { useEffect, useState } from "react";

interface Props {
  token: string | null;
  mutate: () => void;
  themeColor: $Enums.ThemeColorId | undefined;
  currentTheme: ThemeColor;
  setCurrentTheme: React.Dispatch<React.SetStateAction<ThemeColor>>;
}

const ThemeSelector: React.FC<Props> = ({
  token,
  mutate,
  themeColor,
  currentTheme,
  setCurrentTheme,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  // 初期テーマカラーを設定
  useEffect(() => {
    if (themeColor) {
      const initialTheme = themeColor.replace("bg-", "") as ThemeColor;
      setCurrentTheme(initialTheme);
    }
  }, [themeColor, setCurrentTheme]);
  const handleThemeChange = async (themeId: ThemeColor) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
        body: JSON.stringify({ themeColorId: themeId }),
      });
      if (!response.ok) {
        throw new Error("Failed to update theme color");
      }
      mutate();
      setCurrentTheme(themeId);
    } catch (error) {
      console.error("テーマ色の変更に失敗しました。", error);
      alert("テーマ色の変更に失敗しました。");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="grid grid-cols-5 gap-5 mb-12">
      {Object.entries(themeColors).map(([themeId, color]) => {
        const themeKey = themeId as ThemeColor;
        return (
          <div
            key={themeId}
            onClick={() => handleThemeChange(themeKey)}
            className={`${color} w-12 h-12 mx-auto rounded-full cursor-pointer ${
              loading ? "opacity-50 pointer-events-none" : ""
            } ${
              currentTheme === themeKey
                ? "border-4 border-text_button"
                : "border border-gray-300"
            }`}
          ></div>
        );
      })}
    </div>
  );
};

export default ThemeSelector;
