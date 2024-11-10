import React, { useState } from "react";
import { supabase } from "@/utils/supabase"; //Supabaseクライアントをインポート
// import { useRouter } from "next/router";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  // const router = useRouter();

  // パスワードリセットリクエストを送信する関数
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`, // リセット後に遷移するページ
    });

    if (error) {
      setMessage(
        "パスワードリセットメールの送信に失敗しました: " + error.message
      );
    } else {
      setMessage("パスワードリセットメールを送信しました。");
    }
  };

  return (
    <div>
      <h2>パスワードを忘れた方</h2>
      <form onSubmit={handlePasswordReset}>
        <label htmlFor="email">メールアドレス</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">パスワードリセットメールを送信</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
