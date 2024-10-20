"use client";
import React, { useState } from "react";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Image from "next/image"; // Imageコンポーネントをインポート
import memo from "../../img/memo.png";
import openPw from "../../img/openPw.png";
import closePw from "../../img/closePw.png";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("ログインに失敗しました。");
    } else {
      // APIにリクエストを送信する処理
      const token = data.session?.access_token;
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            email,
            //optionsはuser_metadataの中に入る
            userName: data.user.user_metadata.userName,
            themeColorId: "Theme01",
          }),
        });

        const result = await response.json();
        if (response.ok) {
          router.replace("/calendar");
        } else {
          alert("APIリクエストに失敗しました: " + result.message);
        }
      } catch (apiError) {
        console.error("APIリクエストエラー:", apiError);
        alert("APIリクエスト中にエラーが発生しました。");
      }
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
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"} // パスワードの表示/非表示を切り替え
              name="password"
              placeholder="パスワード"
              className="mx-auto mb-8 bg-gray-50  text-gray-900 text-sm  block w-[80%] p-3"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
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
                  className="w-5 h-5 text-[#cccccc]"
                />
              ) : (
                <Image
                  src={openPw}
                  alt="openPw"
                  width={32}
                  height={32}
                  className="w-5 h-5 text-[#cccccc]"
                />
              )}
            </div>
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
