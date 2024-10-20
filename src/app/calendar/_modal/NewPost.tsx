"use client";
import React, { useState } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button";

const NewPost = () => {
  const { token } = useSupabaseSession();
  const router = useRouter();
  const [userId, setUserId] = useState(1); // ここで適切なユーザーIDを設定
  const [scheduleDate, setScheduleDate] = useState("");
  const [content, setContent] = useState("");
  const [scheduleColor, setScheduleColor] = useState("#FF0080"); // default

  const colorNameMap = {
    "#FF0080": "Pink",
    "#0062FF": "Blue",
    "#27BA2E": "Green",
    "#FF6F00": "Orange",
    "#00E5FF": "Cyan",
    "#E3C901": "Yellow",
    "#A92782": "Purple",
    "#8A30FF": "Violet",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    // 日付をISO形式に変換
    const formattedDate = new Date(scheduleDate).toISOString();

    const res = await fetch("/api/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({
        userId,
        scheduleDate: formattedDate,
        content,
        scheduleColor: colorNameMap[scheduleColor],
        createdAt: formattedDate,
        updatedAt: formattedDate,
      }),
    });

    if (res.ok) {
      alert("予定が登録されました！");
      setScheduleDate("");
      setContent("");
      setScheduleColor("#FF0080");
      // setIsModalOpen(false);
      //modalを消したい
      router.push("/calendar");
    } else {
      alert("登録に失敗しました。");
    }
  };

  return (
    <div>
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
            {Object.keys(colorNameMap).map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setScheduleColor(color)}
                className={`w-10 aspect-square rounded-full focus:border-4 focus:border-white border-solid ${color.toLowerCase()}`}
                style={{ backgroundColor: color.toLowerCase() }}
              />
            ))}
          </div>
          <Button text="登録" />
        </div>
      </form>
    </div>
  );
};

export default NewPost;
