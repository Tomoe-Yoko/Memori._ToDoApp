"use client";
import React, { useState } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import Button from "@/app/_components/Button";
import { CalendarPostType } from "@/app/_type/Calendar";
import { ScheduleColor } from "@prisma/client";
import toast, { Toaster } from "react-hot-toast"; //https://react-hot-toast.com/
import dayjs from "dayjs";

export const scheduleColorMap: Record<string, ScheduleColor> = {
  "#FF0080": "Pink",
  "#0062FF": "Blue",
  "#27BA2E": "Green",
  "#FF6F00": "Orange",
  "#00E5FF": "Cyan",
  "#E3C901": "Yellow",
  "#A92782": "Wine",
  "#8A30FF": "Purple",
};

interface ModalProps {
  onSuccess: () => void; //登録したらモーダル閉じる＋toastを表示のcallback関数
  initialDate: Date; //初期日付の設定
}
const NewPost: React.FC<ModalProps> = ({ onSuccess, initialDate }) => {
  const { token } = useSupabaseSession();

  const newPostData: CalendarPostType = {
    // scheduleDate: new Date().toISOString(),
    // initialDate: Date; //初期日付の設定
    scheduleDate: dayjs(initialDate).format("YYYY-MM-DD"), // 初期日付を設定
    content: "",
    scheduleColor: "Pink" as ScheduleColor, // default
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const [postData, setPostData] = useState<CalendarPostType>(newPostData);
  const [selectedColor, setSelectedColor] = useState<string>("#FF0080");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const response = await fetch("/api/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({
        ...postData,
      }),
    });

    if (response.ok) {
      onSuccess(); //onSuccess：モーダルを閉じる、toastの表示、スケジュール追加のprops（handleSuccess関数）
    } else {
      toast.error("登録に失敗しました。", {
        duration: 2100, //ポップアップ表示時間
      });
    }
  };

  return (
    <div className="bg-white">
      <h2 className="text-center text-2xl mb-4 text-text_button">Calendar.</h2>
      <form onSubmit={handleSubmit}>
        {/* 予定の内容 */}
        <div className="mb-8">
          <label
            htmlFor="content"
            className="block text-lg mb-2 text-text_button"
          >
            予定の内容 (15文字以内)
          </label>
          <input
            id="content"
            type="text"
            name="content"
            value={postData.content}
            onChange={(e) =>
              setPostData({ ...postData, content: e.target.value })
            }
            required
            maxLength={15}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* 日付 */}
        <div className="mb-8">
          <label htmlFor="date" className="block text-lg mb-2 text-text_button">
            日付
          </label>
          <input
            id="date"
            type="date"
            name="scheduleDate"
            value={postData.scheduleDate}
            onChange={(e) =>
              setPostData({
                ...postData,
                scheduleDate: e.target.value,
              })
            }
            required
            className="w-full p-2 border rounded bg-white"
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
                onClick={() => {
                  setPostData({
                    ...postData,
                    scheduleColor: scheduleColorMap[color],
                  });
                  setSelectedColor(color); // 選択された色を更新
                }}
                className={`w-10 aspect-square rounded-full ${
                  selectedColor === color
                    ? "border-white border-solid border-4"
                    : ""
                }`}
                style={{ backgroundColor: color.toLowerCase() }}
              />
            ))}
          </div>
          <div className="mt-8">
            <Button text="登録" />
          </div>
          <Toaster position="top-center" />
        </div>
      </form>
    </div>
  );
};

export default NewPost;
