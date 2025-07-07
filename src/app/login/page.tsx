"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/app/_utils/supabase";
import { useRouter } from "next/navigation";
import Button from "../_components/Button";
import Footer from "../_components/Footer";
import Image from "next/image"; // Imageコンポーネントをインポート
import memo from "@/app/public/img/memo.png";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import PasswordInput from "../_components/PasswordInput";
import Loading from "../loading";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data === undefined) {
          return <Loading />;
        }

        if (data) {
          router.replace(data.session ? "/login/welcome" : "/login");
          return <Loading />;
        }
      } catch (error) {
        console.error("セッション情報取得失敗:", error);
        router.replace("/login");
        return <Loading />;
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Supabaseでログイン
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("ログインに失敗しました。");
    } else {
      // APIにリクエストを送信する処理
      const token = data.session?.access_token;
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            email,
            //optionsはuser_metadataの中に入る
            userName: data.user.user_metadata.userName || "Guest",
            // themeColorId: "Theme01",
            themeColorId: data.user.user_metadata.themeColorId || "Theme01",
          }),
        });

        const result = await response.json();
        if (response.ok) {
          router.replace("/login/welcome");
          return <Loading />;
        } else {
          toast.error(`APIリクエストに失敗しました: ${result.message} `);
        }
      } catch (apiError) {
        console.error("APIリクエストエラー:", apiError);
        toast.error("APIリクエスト中にエラーが発生しました。");
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
      <h2 className="text-center text-xl my-4 text-text_button">ログイン</h2>
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
              className="mx-auto mb-4 bg-gray-50  text-gray-900 text-[1rem] block w-[80%] p-3"
            />
          </div>
          <PasswordInput password={password} setPassword={setPassword} />

          <p className="text-center text-[#4a72ba] text-base">
            <Link href="/reset_password/send_email">
              ※パスワードを忘れた方はこちら
            </Link>
          </p>
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
