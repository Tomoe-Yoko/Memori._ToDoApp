"use client";
import React, { useCallback, useEffect, useState } from "react";
import Button from "../_components/Button";
import Navigation from "../_components/Navigation";
import { useSupabaseSession } from "../_hooks/useSupabaseSession";

const THEME_COLORS = [
  { id: "Theme01", color: "#E4C8CE" },
  { id: "Theme02", color: "#C8D3E4" },
  { id: "Theme03", color: "#C8E4C9" },
  { id: "Theme04", color: "#E2E4C8" },
  { id: "Theme05", color: "#D4C8E4" },
  { id: "Theme06", color: "#E4ACB8" },
  { id: "Theme07", color: "#98BDE0" },
  { id: "Theme08", color: "#AEE6B1" },
  { id: "Theme09", color: "#E6EC94" },
  { id: "Theme10", color: "#BAAACF" },
  { id: "Theme11", color: "#C6B3B2" },
  { id: "Theme12", color: "#A6BBA7" },
  { id: "Theme13", color: "#C4C796" },
  { id: "Theme14", color: "#C3C3C3" },
  { id: "Theme15", color: "#333333" },
];

const SettingsPage: React.FC = () => {
  const { token } = useSupabaseSession();
  const [currentTheme, setCurrentTheme] = useState<string>("Theme01");
  const [loading, setLoading] = useState<boolean>(false);
  // 背景色を変更するための副作用
  useEffect(() => {
    const themeColor = THEME_COLORS.find((theme) => theme.id === currentTheme);
    if (themeColor) {
      document.body.style.backgroundColor = themeColor.color;
    }
  }, [currentTheme]);
  const fetcher = useCallback(async () => {
    const res = await fetch("/api/calendar", {
      headers: {
        "Content-Type": "application/json",
        Authorization: token!,
      },
    });

    if (res.ok) {
      const { currentTheme } = await res.json();
      setCurrentTheme(currentTheme);
    } else {
      console.error("Empty response body");
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    setLoading(false);
    fetcher();
  }, [fetcher, token]);
  // テーマ色を変更する関数
  const handleThemeChange = async (themeId: string) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // 認証トークンを送信
        },
        body: JSON.stringify({ themeColorId: themeId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update theme color");
      }

      setCurrentTheme(themeId); // 成功したらローカルでテーマを更新
    } catch (error) {
      console.error(error);
      alert("テーマ色の変更に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-white text-2xl text-center">Setting.</h2>
      <div className="w-[80%] mx-auto my-8 bg-white p-4">
        <div className="grid grid-cols-5 gap-5 mb-16">
          {THEME_COLORS.map((theme) => (
            <div
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`w-12 h-12  mx-auto rounded-full cursor-pointer ${
                loading ? "opacity-50 pointer-events-none" : ""
              } ${
                currentTheme === theme.id
                  ? "border-4 border-text_button"
                  : "border border-gray-300"
              }`}
              style={{ backgroundColor: theme.color }}
            ></div>
          ))}
        </div>
        <hr className="text-text_button" />
        <div className="mt-8">
          <Button text="ユーザーネーム変更" />
        </div>
        <div className="mt-8">
          <Button text="お問合せ" />
        </div>
        <div className="mt-8">
          <Button text="ログアウト" />
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default SettingsPage;
