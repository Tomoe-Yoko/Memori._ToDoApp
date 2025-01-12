"use client";

import Button from "@/app/_components/Button";
import React, { useState, FormEvent, ChangeEvent } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import toast, { Toaster } from "react-hot-toast";
import Navigation from "../../_components/Navigation";

interface Errors {
  name?: string;
  email?: string;
  text?: string;
}

const Contact: React.FC = () => {
  const { token } = useSupabaseSession();
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({
    name: "",
    email: "",
    text: "",
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  //送信中かどうかを管理

  const validate = () => {
    const newErrors: Errors = {};

    if (!userName) {
      newErrors.name = "お名前は必須です";
    } else if (userName.length >= 30) {
      newErrors.name = "30文字以内で入力してください";
    }

    if (!email) {
      newErrors.email = "メールアドレスは必須です";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "有効なメールアドレスを入力してください";
    }

    if (!text) {
      newErrors.text = "本文は必須です";
    } else if (text.length >= 500) {
      newErrors.text = "本文は500文字以内で入力してください";
    }
    console.log(Object.keys(newErrors).length);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    if (!confirm("送信しますか？")) return;
    if (!token) {
      alert("認証が必要です。ログインしてください。");
      return;
    }
    e.preventDefault();
    if (!validate()) {
      return;
    }

    try {
      const res = await fetch("api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ userName, email, text }),
      });
      console.log(res);

      if (res.ok) {
        setSubmitting(true);
        toast.success(
          <span>
            メールが送信されました。
            <br />
            返信までしばらくお待ちください。
          </span>,
          {
            duration: 2100,
          }
        );
        handleClear();
      } else {
        throw new Error("送信に失敗しました");
      }
    } catch (error) {
      alert("送信中にエラーが発生しました");
      throw error;
    } finally {
      setSubmitting(false);
    }
  };
  //allClear
  const handleClear = () => {
    setUserName("");
    setEmail("");
    setText("");
    setErrors({
      name: "",
      email: "",
      text: "",
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUserName(e.target.value);
  return (
    <div className="mb-[73px]">
      <h2 className="text-white text-2xl text-center">Contact.</h2>
      <form
        onSubmit={handleSubmit}
        className="w-[80%] mx-auto my-8 bg-[#fff7] p-4 text-text_button"
      >
        <div className="name mx-4 mb-4 h-full">
          <label htmlFor="name">お名前</label>
          <div>
            <input
              id="name"
              type="text"
              value={userName}
              onChange={handleChange}
              disabled={submitting}
              className=" w-full p-3"
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>
        </div>
        <div className="email m-4">
          <label htmlFor="email">メールアドレス</label>
          <div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              className="w-full p-3"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
        </div>
        <div className="message m-4">
          <label htmlFor="message">お問合せ内容</label>
          <div>
            <textarea
              name="message"
              id="message"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={submitting}
              className=" w-full h-48  p-3"
            />
            {errors.text && <p className="text-red-500">{errors.text}</p>}
          </div>
        </div>
        <div className="flex justify-center" onClick={handleSubmit}>
          <Button text="送信" />
        </div>
      </form>
      <Navigation />
      <Toaster position="top-center" />
    </div>
  );
};

export default Contact;
