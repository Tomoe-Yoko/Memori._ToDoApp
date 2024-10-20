"use client";
import React from "react";
import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import PlusButton from "../components/plusButton";
import { useRouter } from "next/navigation";
import "react-calendar/dist/Calendar.css"; // デフォルトスタイルをインポート
import "../../app/globals.css";
import Modal from "react-modal";

const Page = () => {
  const router = useRouter();
  const handleAddEvent = () => {
    router.push("/calendar/new");
  };
  const removeSuffix = (locale: string, date: Date): string => {
    return date.getDate().toString(); // 日付の数字だけを表示
  };

  const removeMonthYearSuffix = (locale: string, date: Date): string => {
    return `${date.getFullYear()}.${date.getMonth() + 1}`; // 月のみ表示
  };

  return (
    <div>
      <h2 className="text-white text-2xl text-center">Calendar.</h2>
      <Calendar
        locale="ja-JP"
        prev2Label={null}
        next2Label={null}
        formatDay={removeSuffix} // 「日」を削除したフォーマット
        formatMonthYear={removeMonthYearSuffix} // 「年」を削除したフォーマット
        formatShortWeekday={(locale, date) =>
          ["日", "月", "火", "水", "木", "金", "土"][date.getDay()]
        } // 曜日をカスタマイズ
        className={"react-calendar"}
      />
      <div className="flex justify-end mr-4">
        <button
          onClick={handleAddEvent}
          className="block w-[55px] aspect-square rounded-full bg-text_button text-white text-xl"
        >
          ＋
        </button>
      </div>
      <Modal></Modal>
    </div>
  );
};

export default Page;
