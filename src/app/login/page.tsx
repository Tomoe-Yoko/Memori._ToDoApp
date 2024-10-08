"use client";
import React, { useState } from "react";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Image from "next/image"; // Imageコンポーネントをインポート
import memo from "../../img/memo.png";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert("ログインに失敗しました。");
    } else {
      router.replace("/calendar");
    }
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
      <h2 className="text-center text-2xl my-4 text-text_button">ログイン</h2>
      <div className="flex justify-center py-8 mx-8 bg-[#fff6]">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-[400px]"
        >
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
          <div>
            <input
              type="password"
              name="password"
              placeholder="パスワード"
              className="mx-auto mb-8 bg-gray-50  text-gray-900 text-sm  block w-[80%] p-3"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <p className="text-center text-[#729EF0] text-xl">
            <a href="">※パスワードを忘れた方はこちら</a>
          </p>
          <div>
            <Button text="送信" />
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
