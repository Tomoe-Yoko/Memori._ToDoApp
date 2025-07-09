import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { supabase } from "../_utils/supabase";
import { mutate } from "swr";

export const GuestLoginButton = () => {
  const router = useRouter();

  const handleGuestLogin = async () => {
    const email = process.env.NEXT_PUBLIC_GUEST_EMAIL;
    const password = process.env.NEXT_PUBLIC_GUEST_PASSWORD;
    if (!email || !password) {
      throw new Error(
        "ゲストログインできませんでした。環境変数を確認してください。"
      );
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw new Error("ゲストログインできませんでした。" + error.message);
      }

      router.replace("/calendar");
      toast.success("ゲストログインしました", {
        duration: 2100,
      });
      mutate("/api/users");
    } catch (error) {
      toast.error("ゲストログインに失敗しました。");
      console.error("Guest login error:", error);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleGuestLogin}
        className="block mx-auto px-4 text-text_button border-2 border-text_button rounded-lg  focus:outline-none w-56 py-3 text-base hover:bg-[#eeea]"
      >
        ゲストログイン
      </button>
    </div>
  );
};
