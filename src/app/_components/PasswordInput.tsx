// "use client";

import React, { useState } from "react";
import Image from "next/image";
import openPw from "@/app/public/img/openPw.png";
import closePw from "@/app/public/img/closePw.png";

interface PasswordInputProps {
  password: string; // 入力されたパスワード
  setPassword: React.Dispatch<React.SetStateAction<string>>; // パスワードを更新する関数
  isSubmitting?: boolean; // 入力フォームを無効化するかどうか
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  password,
  setPassword,
  isSubmitting = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"} // パスワードの表示/非表示を切り替え
        name="password"
        placeholder="パスワード"
        className="mx-auto mb-8 bg-gray-50 text-gray-900 text-[1rem] block w-[80%] p-3"
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
  );
};

export default PasswordInput;
