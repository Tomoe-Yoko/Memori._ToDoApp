//setting/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "../_context/ThemeContext";
import Button from "../_components/Button";
import Navigation from "../_components/Navigation";
import { useSupabaseSession } from "../_hooks/useSupabaseSession";
import { themeColors } from "../_type/login";
import Input from "../_components/Input";

const SettingsPage: React.FC = () => {
  const { themeColor, setThemeColor } = useTheme();
  const { token } = useSupabaseSession();
  const [currentTheme, setCurrentTheme] = useState<string>("Theme01");
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetcher = async () => {
      if (!token) return;

      try {
        const res = await fetch("/api/login", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token!,
          },
        });
        if (res.ok) {
          const { userData } = await res.json();
          setCurrentTheme(userData.themeColorId);
          setThemeColor(themeColors[userData.themeColorId]);
          setUserName(userData.userName);
        } else {
          throw new Error("現在のテーマカラーを取得できませんでした。");
        }
      } catch (error) {
        if (error instanceof Error) console.error(error.message);
      }
    };
    fetcher();
  }, [token]);

  useEffect(() => {
    // bodyの背景色を設定
    document.body.style.backgroundColor = themeColor;
  }, [themeColor]);

  const handleThemeChange = async (themeId: string) => {
    if (!token) return;
    setThemeColor(themeColors[themeId]); // 即時にテーマカラーを更新
    setLoading(true);
    try {
      const response = await fetch("/api/login", {
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

      setCurrentTheme(themeId);
    } catch (error) {
      console.error(error);
      alert("テーマ色の変更に失敗しました。");
    } finally {
      setLoading(false);
    }
  };
  //userName
  const handleUserNameChange = async () => {
    if (!token || !userName) return;
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
        body: JSON.stringify({ userName }),
      });
      if (!response.ok) {
        throw new Error("ユーザーネームの変更に失敗しました。");
      }
      alert("ユーザーネームが変更されました");
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: themeColor, minHeight: "100vh" }}>
      {/* <div className={`bg-${themeColor}`}> */}
      <h2 className="text-white text-2xl text-center">Setting.</h2>
      <div className="w-[80%] mx-auto my-8 bg-white p-4">
        <div className="grid grid-cols-5 gap-5 mb-12">
          {Object.entries(themeColors).map(([themeId, color]) => (
            <div
              key={themeId}
              onClick={() => handleThemeChange(themeId)}
              className={`w-12 h-12 mx-auto rounded-full cursor-pointer ${
                loading ? "opacity-50 pointer-events-none" : ""
              } ${
                currentTheme === themeId
                  ? "border-4 border-text_button"
                  : "border border-gray-300"
              }`}
              style={{ backgroundColor: color }}
            ></div>
          ))}
        </div>
        {/* <hr className="text-text_button" /> */}
        <div className="mt-8 mx-auto w-[70%]">
          <Input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="新しいユーザーネームを入力"
          />
        </div>
        <div onClick={handleUserNameChange}>
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
