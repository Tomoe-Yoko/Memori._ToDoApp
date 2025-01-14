//ユーザー登録！
"use client";
import { supabase } from "@/utils/supabase";
import React, { useState } from "react";
import Button from "../_components/Button";
import Footer from "../_components/Footer";
import Image from "next/image"; // Imageコンポーネントをインポート
import memo from "@/app/public/img/memo.png";
import toast, { Toaster } from "react-hot-toast";
import PasswordInput from "../_components/PasswordInput";

export default function Page() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        //optionsでユーザーネームを登録
        data: { userName },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_URL}/login`,
      },
    });
    if (error) {
      toast.error("登録に失敗しました。");
    } else {
      //Thank youのページにする
      toast.success("確認メールを送信しました。");
    }
    setUserName("");
    setEmail("");
    setPassword("");
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
        サインアップ
      </h2>
      <div className="flex justify-center py-8 mx-8 bg-[#fff6]">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-[400px]"
        >
          <div>
            <input
              type="userName"
              name="userName"
              placeholder="ユーザーネーム"
              required
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              className="mx-auto mb-8 bg-gray-50  text-gray-900 text-sm  block w-[80%] p-3"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="メールアドレス"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="mx-auto mb-8 bg-gray-50  text-gray-900 text-sm  block w-[80%] p-3"
            />
          </div>
          <PasswordInput password={password} setPassword={setPassword} />

          <div>
            <Button text="登録" />
          </div>
        </form>
        <Toaster position="top-center" />
      </div>
      <Footer />
    </div>
  );
}
