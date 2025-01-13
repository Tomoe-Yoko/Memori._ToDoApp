"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useUser } from "@/app/_hooks/useUser";

const WelcomePage: React.FC = () => {
  const { token } = useSupabaseSession();
  const { userName, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    // タイマーを設定して1.8秒後にページ遷移
    const timer = setTimeout(() => {
      router.push("/calendar");
    }, 1800);

    return () => clearTimeout(timer);
  }, [router, token, isLoading]);

  return (
    <div className="">
      <div className="text-white text-2xl">
        <p className="leading-relaxed text-white pt-[12rem] text-center text-2xl">
          <span className="text-[28px]">{userName}さん</span>
          <br />
          今日もおつかれさま
        </p>
      </div>
      <svg
        width="148"
        height="127"
        viewBox="0 0 148 127"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full pl-[13rem]"
      >
        <path
          d="M6.31356 115.845C7.77746 105.845 15.3474 85.0141 33.9161 81.6948C57.127 77.5457 80.2161 85.6571 100.198 75.6623C120.507 65.5037 131.56 43.5679 135.299 30.7671"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle
          cx="142.877"
          cy="15.318"
          r="4.21685"
          transform="rotate(4.75489 142.877 15.318)"
          fill="white"
        />
      </svg>
    </div>
  );
};

export default WelcomePage;
