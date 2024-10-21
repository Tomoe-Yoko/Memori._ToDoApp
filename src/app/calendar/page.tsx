"use client";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // デフォルトスタイルをインポート
import "../../app/globals.css";
import { CalendarProps } from "../_type/Calendar";
import Modal from "react-modal";
import NewPost from "./_modal/NewPost";
import Button from "../components/Button";

//Modal.setAppElement("#root");

const Page: React.FC = () => {
  const [addScheduleModal, setAddScheduleModal] = useState(false);

  const removeMonthYearSuffix = ({ date }: CalendarProps): string => {
    return `${date.getFullYear()}.${date.getMonth() + 1}`; // 2024.10と表示
  };

  const removeSuffix = ({ date }: CalendarProps): string => {
    return date.getDate().toString(); // 日付の数字だけを表示(文字列化)
  };

  const closeModal = () => setAddScheduleModal(false);

  return (
    <div className="relative">
      <h2 className="text-white text-2xl text-center">Calendar.</h2>
      <Calendar
        locale="ja-JP"
        prev2Label={null}
        next2Label={null}
        formatDay={(_, date) => removeSuffix({ date })}
        formatMonthYear={(_, date) => removeMonthYearSuffix({ date })}
        formatShortWeekday={(_, date) =>
          ["日", "月", "火", "水", "木", "金", "土"][date.getDay()]
        }
        className={"react-calendar"}
      />
      <div className="flex justify-end mr-4">
        <button
          onClick={() => setAddScheduleModal(true)}
          className="block w-[55px] aspect-square rounded-full bg-text_button text-white text-xl"
        >
          ＋
        </button>
      </div>
      <Modal
        isOpen={addScheduleModal}
        onRequestClose={closeModal}
        className="bg-001 p-16 max-w-lg mx-auto mt-24 rounded shadow-lg"
        overlayClassName="absolute top-0 w-full bg-black bg-opacity-50 flex justify-center items-center"
      >
        <NewPost />
        <div onClick={closeModal} className="mt-[-32px]">
          <Button text="キャンセル" />
        </div>
      </Modal>
    </div>
  );
};

export default Page;
