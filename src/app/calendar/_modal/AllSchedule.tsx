"use client";
import React, { useState, useEffect } from "react";
import Button from "@/app/components/Button";
import { CalendarData } from "../../_type/Calendar"; // Scheduleの型を適切にインポート
import { scheduleColorMap } from "./NewPost";
import CloseButton from "@/app/components/CloseButton";

interface Props {
  selectedDate: Date | null;
  closeModal: () => void;
  calendars: CalendarData[]; // 親コンポーネントから予定を受け取る
}

const AllSchedule: React.FC<Props> = ({
  selectedDate,
  closeModal,
  calendars,
}) => {
  const [schedules, setSchedules] = useState<CalendarData[]>([]);

  useEffect(() => {
    if (selectedDate) {
      const dateString = selectedDate.toLocaleDateString("ja-JP");
      const daySchedules = calendars.filter((entry) => {
        const entryDateString = new Date(entry.scheduleDate).toLocaleDateString(
          "ja-JP"
        );
        return entryDateString === dateString;
      });

      setSchedules(daySchedules);
    }
  }, [selectedDate, calendars]);
  return (
    <div className="relative">
      <div className="absolute top-[-40px] right-[-30px]">
        <CloseButton onClick={closeModal} />
      </div>
      <h2 className="text-white text-2xl py-4">
        {selectedDate?.toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          weekday: "short",
        })}
      </h2>
      <div className="space-y-2 bg-[#fffa] rounded-xl p-4 leading-normal">
        {schedules.length > 0 ? (
          schedules.map((entry) => {
            const colorCode = Object.keys(scheduleColorMap).find(
              (key) => scheduleColorMap[key] === entry.scheduleColor
            );
            return (
              <p
                key={entry.id}
                style={{ color: colorCode }}
                className="text-base"
              >
                {entry.content}
              </p>
            );
          })
        ) : (
          <p className="text-text_button">予定がありません。</p>
        )}
      </div>
      <div onClick={closeModal} className="mt-8">
        <Button text="閉じる" />
      </div>
    </div>
  );
};

export default AllSchedule;
