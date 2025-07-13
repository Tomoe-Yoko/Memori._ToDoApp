"use client";
import React, { useState } from "react";
import { supabase } from "@/app/_utils/supabase";
import Button from "@/app/_components/Button";
import Footer from "@/app/_components/Footer";
import Image from "next/image"; // Imageコンポーネントをインポート
import memo from "@/app/public/img/memo.png";
import toast, { Toaster } from "react-hot-toast";

const Page = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_URL}/reset_password/setting_pass`,
    });
    if (error) {
      toast.error("再設定メールの送信に失敗しました");
    } else {
      setEmail("");
      toast.success(
        <span>
          メールを送信しました。
          <br />
          ご確認お願いします。
        </span>,
        {
          duration: 2100, //ポップアップ表示時間
        }
      );
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
        パスワードの再設定
      </h2>

      <div className=" py-8 mx-8 bg-[#fff6]">
        <form
          onSubmit={sendEmailSubmit}
          className="space-y-4 w-full max-w-[400px]"
        >
          <p className="text-center text-text_button space-y-4  text-sm">
            登録済のメールアドレスを入力してください
          </p>
          <div>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="メールアドレス"
              disabled={isSubmitting}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="mx-auto mb-8 bg-gray-50  text-gray-900 text-sm  block w-[80%] p-3"
            />
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
