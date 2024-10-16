//ユーザー登録！
"use client";
import { supabase } from "@/utils/supabase";
import React, { useState } from "react";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Image from "next/image"; // Imageコンポーネントをインポート
import memo from "../../img/memo.png";

export default function Page() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:3000/login",
      },
    });
    if (error) {
      alert("登録に失敗しました。");
    } else {
      // ユーザー名をプロフィール情報として保存
      const user = data.user;
      if (user) {
        const { error: updateError } = await supabase
          .from("Users") // 'Users'はあなたのプロフィールテーブルの名前です
          .insert([{ id: user.id, userName }]);

        if (updateError) {
          console.error("プロフィールの更新に失敗しました:", updateError);
          alert("プロフィールの更新に失敗しました。");
        } else {
          alert("確認メールを送信しました。");
        }
      }
      setUserName("");
      setEmail("");
      setPassword("");
      // alert("確認メールを送信しました。");
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
      <h2 className="text-center text-2xl my-4 text-text_button">
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
          <div>
            <Button text="登録" />
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
