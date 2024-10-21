"use client";
import React, { useState } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button";
import { CalendarPostType } from "@/app/_type/Calendar";
import { ScheduleColor } from "@prisma/client";
import toast, { Toaster } from "react-hot-toast"; //https://react-hot-toast.com/

const NewPost: React.FC = () => {
  const { token } = useSupabaseSession();
  const router = useRouter();

  const newPostData: CalendarPostType = {
    userId: 1, // ここで適切なユーザーIDを設定
    scheduleDate: new Date().toISOString(),
    content: "",
    scheduleColor: "Pink" as ScheduleColor, // default
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const [postData, setPostData] = useState<CalendarPostType>(newPostData);

  const scheduleColorMap: Record<string, ScheduleColor> = {
    "#FF0080": "Pink",
    "#0062FF": "Blue",
    "#27BA2E": "Green",
    "#FF6F00": "Orange",
    "#00E5FF": "Cyan",
    "#E3C901": "Yellow",
    "#A92782": "Wine",
    "#8A30FF": "Purple",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const response = await fetch("/api/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({
        ...postData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      toast.success("予定が登録されました！");
      setPostData(newPostData);
      //closeModalにしたい
      router.push("/calendar");
    } else {
      toast.error("登録に失敗しました。");
    }
  };

  return (
    <div>
      <h2 className="text-center text-2xl mb-4 text-white">Calendar.</h2>
      <form onSubmit={handleSubmit}>
        {/* 予定の内容 */}
        <div className="mb-8">
          <label className="block text-lg mb-2 text-text_button">
            予定の内容 (23文字以内)
          </label>
          <input
            type="text"
            name="content"
            value={postData.content}
            onChange={(e) =>
              setPostData({ ...postData, content: e.target.value })
            }
            required
            maxLength={23}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* 日付 */}
        <div className="mb-8">
          <label className="block text-lg mb-2 text-text_button">日付</label>
          <input
            type="date"
            name="scheduleDate"
            value={postData.scheduleDate.substring(0, 10)}
            onChange={(e) =>
              setPostData({
                ...postData,
                scheduleDate: new Date(e.target.value).toISOString(),
              })
            }
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* 文字色選択 */}
        <div>
          <label className="block text-lg mb-2 text-text_button">
            予定の文字色
          </label>
          <div className="grid grid-cols-4 gap-4">
            {Object.keys(scheduleColorMap).map((color) => (
              <button
                key={color}
                type="button"
                onClick={() =>
                  setPostData({
                    ...postData,
                    scheduleColor: scheduleColorMap[color],
                  })
                }
                className={`w-10 aspect-square rounded-full focus:border-4 focus:border-white border-solid`}
                style={{ backgroundColor: color.toLowerCase() }}
              />
            ))}
          </div>
          <Button text="登録" />
          <Toaster position="bottom-center" />
        </div>
      </form>
    </div>
  );
};

export default NewPost;
