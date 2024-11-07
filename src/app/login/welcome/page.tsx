"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";

interface Props {
  user: string;
}

const WelcomePage: React.FC<Props> = () => {
  const [useName, setUserName] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchUserName = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("ユーザーネーム取得に失敗しました。", error.message);
        return;
      }
      if (user) {
        const userName = user.user_metadata.userName || "ユーザーネーム";
        setUserName(userName);
      }
    };
    fetchUserName();

    // タイマーを設定して1.8秒後にページ遷移
    const timer = setTimeout(() => {
      router.push("/calendar");
    }, 2100);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="relative max-w-md bg-001 m-auto border-r border-l border-white ">
      <div className="animation ">
        <p className="text-center">
          {useName}さん
          <br />
          今日もおつかれさま
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;
