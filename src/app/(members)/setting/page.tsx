"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Button from "../../_components/Button";
import Navigation from "../../_components/Navigation";
import { useSupabaseSession } from "../../_hooks/useSupabaseSession";
import { ThemeColor } from "../../_type/login";
import toast, { Toaster } from "react-hot-toast";
import useLogout from "../../_hooks/useLogout";
import { useUser } from "@/app/_hooks/useUser";
import ThemeSelector from "./_components/ThemeSelector";
import UserNameChange from "./_components/UserNameChange";
const SettingsPage: React.FC = () => {
  const { token } = useSupabaseSession();

  const [loading, setLoading] = useState<boolean>(false);
  const logout = useLogout(); // ログアウト関数を取得
  const { mutate, themeColor, userName: getUserName } = useUser();
  const [userName, setUserName] = useState<string | null | undefined>("");
  const [currentTheme, setCurrentTheme] = useState<ThemeColor>(
    ThemeColor.Theme01
  );
  useEffect(() => {
    if (getUserName) setUserName(getUserName);
  }, [getUserName]);

  // 初期テーマカラーを設定
  useEffect(() => {
    // mutate();
    if (themeColor) {
      const initialTheme = themeColor.replace("bg-", "") as ThemeColor;
      setCurrentTheme(initialTheme);
    }
  }, [themeColor]);

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
  const handleUserNameChange = async () => {
    if (!token || !userName) return;
    setLoading(true);
    try {
      const response = await fetch("/api/users", {
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
      mutate({ userData: { userName, themeColor: currentTheme } });
      toast.success("ユーザーネームが変更されました", {
        duration: 2100, //ポップアップ表示時間
      });
    } catch (error) {
      console.error("ユーザーネームの変更に失敗しました。", error);
      alert("ユーザーネームの変更に失敗しました。");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h2 className="text-white text-2xl text-center">Setting.</h2>
      <div className="w-[80%] mx-auto my-8 bg-white p-4">
        {/* <div className="grid grid-cols-5 gap-5 mb-12">
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
        </div> */}
        <ThemeSelector
          currentTheme={currentTheme}
          loading={loading}
          handleThemeChange={handleThemeChange}
        />
        {/* <div className="mt-8 mx-auto w-56 text-lg text-text_button">
          <Input
            value={userName || ""}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="新しいユーザーネームを入力"
          />
        </div>
        <div onClick={handleUserNameChange}>
          <Button text="ユーザーネーム変更" />
        </div> */}
        <UserNameChange
          userName={userName}
          setUserName={setUserName}
          handleUserNameChange={handleUserNameChange}
        />
        <Link href="/contact" className="block mt-8">
          <Button text="お問合せ" />
        </Link>

        <div className="mt-8" onClick={logout}>
          <Button text="ログアウト" />
        </div>
      </div>
      <Navigation />
      <Toaster position="top-center" />
    </div>
  );
};
export default SettingsPage;
