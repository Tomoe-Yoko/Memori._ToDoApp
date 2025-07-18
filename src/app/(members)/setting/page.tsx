"use client";
import React, { useState } from "react";
import Link from "next/link";
import Button from "../../_components/Button";
import Navigation from "../../_components/Navigation";
import { useSupabaseSession } from "../../_hooks/useSupabaseSession";
import { ThemeColor } from "../../_type/login";
import { Toaster } from "react-hot-toast";
import useLogout from "../../_hooks/useLogout";
import ThemeSelector from "./_components/ThemeSelector";
import UserNameChange from "./_components/UserNameChange";
import ToggleStartOfWeek from "@/app/_components/ToggleStartOfWeek";
// import ToggleStartOfWeek from "@/app/_components/toggleStartOfWeek";
const SettingsPage: React.FC = () => {
  const { token } = useSupabaseSession();
  const logout = useLogout(); // ログアウト関数を取得
  const [currentTheme, setCurrentTheme] = useState<ThemeColor>(
    ThemeColor.Theme01
  );

  return (
    <div className="h-svh mb-2">
      <h2 className="text-white text-2xl text-center">Setting.</h2>
      <div className="w-[80%] mx-auto my-6 bg-white p-4">
        <ThemeSelector
          token={token}
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
        />
        <div className="flex-col items-start justify-start">
          <UserNameChange token={token} />
          <ToggleStartOfWeek />
        </div>

        <Link href="/contact" className="block mt-6 w-[85%] mx-auto">
          <Button text="お問合せ" />
        </Link>

        <div className="mt-6" onClick={logout}>
          <Button text="ログアウト" />
        </div>
      </div>
      <Navigation />
      <Toaster position="top-center" />
    </div>
  );
};
export default SettingsPage;
