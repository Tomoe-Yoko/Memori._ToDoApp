"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import Button from "@/app/_components/Button";
import Footer from "@/app/_components/Footer";
import Image from "next/image"; // Imageコンポーネントをインポート
import memo from "@/app/public/img/memo.png";
import toast, { Toaster } from "react-hot-toast";
import PasswordInput from "@/app/_components/PasswordInput";

const Page = () => {
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const setSessionAsync = async () => {
      const query = new URLSearchParams(window.location.search);
      const access_token = query.get("access_token");
      const type = query.get("type");

      if (type === "recovery" && access_token) {
        try {
          const { error } = await supabase.auth.setSession({
            access_token: access_token,
            refresh_token: "", // 必要に応じて設定
          });

          if (error) {
            toast.error("セッションの設定に失敗しました。");
            throw new Error("Failed to set session:", error);
          } else {
            console.log("Session set successfully");
            // 必要に応じて追加の処理を行う
          }
        } catch (error) {
          console.error("An unexpected error occurred:", error);
          toast.error("予期しないエラーが発生しました。");
        }
      }
    };

    setSessionAsync();
  }, []);

  // パスワードリセットの処理
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(
        <span>
          パスワードの再設定に失敗しました。
          <br />
          違うパスワードを試してください。
        </span>,
        {
          duration: 2100, //ポップアップ表示時間
        }
      );
      console.error("Error updating password:", error);
    } else {
      setPassword("");
      toast.success("再設定に成功しました。ログインしてください");
      router.push("/login");
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
          <PasswordInput
            password={password}
            setPassword={setPassword}
            isSubmitting={isSubmitting}
          />
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
