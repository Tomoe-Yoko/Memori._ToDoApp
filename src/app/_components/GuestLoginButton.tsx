import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { supabase } from "../_utils/supabase";

export const GuestLoginButton = () => {
  const router = useRouter();
  const handleGuestLogin = async () => {
    const email = process.env.NEXT_PUBLIC_GUEST_EMAIL;
    const password = process.env.NEXT_PUBLIC_GUEST_PASSWORD;
    if (!email || !password) {
      toast.error("環境変数が設定されていません");
      return;
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        toast.error("ログインに失敗しました。");
        console.error(error.message);
        return;
      }

      mutate("api/users"); // ユーザーデータを更新
      router.replace(data.session ? "/login/welcome" : "/login");
      toast.success("ゲストログインしました");
      console.log("ゲストログイン成功:", data);
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
