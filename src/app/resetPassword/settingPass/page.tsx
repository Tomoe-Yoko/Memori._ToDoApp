"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import Button from "@/app/_components/Button";
import Footer from "@/app/_components/Footer";
import Image from "next/image"; // Imageコンポーネントをインポート
import memo from "@/app/public/img/memo.png";
import openPw from "@/app/public/img/openPw.png";
import closePw from "@/app/public/img/closePw.png";
import toast, { Toaster } from "react-hot-toast";

const Page = () => {
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const access_token = query.get("access_token");
    const type = query.get("type");

    if (type === "recovery" && access_token) {
      // トークンを使ってセッションを設定
      supabase.auth
        .setSession({
          access_token: access_token,
          refresh_token: "", // 必要に応じて設定
        })
        .then(({ error }) => {
          if (error) {
            console.error("Failed to set session:", error.message);
            toast.error("セッションの設定に失敗しました。");
          } else {
            console.log("Session set successfully");
            // 必要に応じて追加の処理を行う
          }
        });
    }
  }, []);

  // パスワードリセットの処理
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.error("Error updating password:", error.message);
      toast.error("パスワードの再設定に失敗しました。");
    } else {
      setPassword("");
      toast.success("再設定に成功しました。ログインしてください");
      router.push("/login/");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="h-dvh">
      <Image
        src={memo}
        alt="topImage"
        width={100}
        height={200}
        className="mx-auto my-8"
      />
      <h2 className="text-center text-xl my-4 text-text_button">
        新しいパスワードを設定
      </h2>
      <div className="flex justify-center py-8 mx-8 bg-[#fff6]">
        <form
          onSubmit={handleResetPassword}
          className="space-y-4 w-full max-w-[400px]"
        >
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"} // パスワードの表示/非表示を切り替え
              name="password"
              placeholder="パスワード"
              className="mx-auto mb-8 bg-gray-50  text-gray-900 text-sm  block w-[80%] p-3"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              disabled={isSubmitting}
            />
            <div
              className="absolute right-12 top-3 transform-translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Image
                  src={closePw}
                  alt="closePw"
                  width={32}
                  height={32}
                  className="w-5 h-5 text-[#CCCCCC]"
                />
              ) : (
                <Image
                  src={openPw}
                  alt="openPw"
                  width={32}
                  height={32}
                  className="w-5 h-5 text-[#CCCCCC]"
                />
              )}
            </div>
          </div>
          <div>
            <Button text="送信" />
          </div>
        </form>
        <Toaster position="top-center" />
      </div>
      <Footer />
    </div>
  );
};

export default Page;
