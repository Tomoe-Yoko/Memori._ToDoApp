"use client";
import React, { useState } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button";
// import { ScheduleColor as ScheduleColorEnum } from "@prisma/client";

// interface EventData {
//   content: string;
//   scheduleDate: string;
//   scheduleColor: string;
// }

const NewPost = () => {
  const { token } = useSupabaseSession();
  const router = useRouter();
  const [userId, setUserId] = useState(0);
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [content, setContent] = useState("");
  const [scheduleColor, setScheduleColor] = useState("#FF0080"); //default

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    //   useEffect(() => {
    //     if (!token) return;
    //     const fetcher = async () => {
    //       const res = await fetch("api/calendar", {
    //         headers: { "Content-type": "application/json", Authorization: token },
    //       });
    //     };
    //     fetcher();
    //   }, [token]);

    // サーバーへPOST
    const res = await fetch("/api/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({
        userId,
        scheduleDate,
        content,
        scheduleColor,
      }),
    });
    if (res.ok) {
      alert("予定が登録されました！");
      router.push("/calendar"); // カレンダーに戻る
    } else {
      alert("登録に失敗しました。");
    }
  };

  return (
    <div className="min-h-screen bg-001 p-8">
      <h2 className="text-center text-2xl mb-4 text-white">Calendar.</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 予定の内容 */}
        <div>
          <label className="block text-lg mb-2 text-text_button">
            予定の内容 (23文字以内)
          </label>
          <input
            type="text"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            maxLength={23}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* 日付 */}
        <div>
          <label className="block text-lg mb-2 text-text_button">日付</label>
          <input
            type="date"
            name="scheduleDate"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* 文字色選択 */}
        <div>
          <label className="block text-lg mb-2 text-text_button">
            予定の文字色
          </label>
          <div className="w-2/3 mx-auto grid grid-cols-4 gap-4">
            {[
              "#FF0080",
              "#0062FF",
              "#27BA2E",
              "#FF6F00",
              "#00E5FF",
              "#E3C901",
              "#A92782",
              "#8A30FF",
            ].map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setScheduleColor(color)}
                className={`w-10 aspect-square rounded-full  focus:border-4
                   focus:border-white border-solid ${color.toLowerCase()}`}
                style={{ backgroundColor: color.toLowerCase() }}
              />
            ))}
          </div>
        </div>

        {/* 登録とキャンセルボタン
        <div className="flex justify-between mt-6">
          <button type="submit" className="w-[45%] p-2 bg-gray-300 rounded">
            登録
          </button>
          <button
            type="button"
            onClick={() => router.push("/calendar")}
            className="w-[45%] p-2 bg-gray-300 rounded"
          >
            キャンセル
          </button> */}
        {/* </div> */}
        <Button text="登録" />
        <Button text="キャンセル" />
      </form>
    </div>
  );
};

export default NewPost;
