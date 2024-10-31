"use client";
import React, { useState, useEffect } from "react";
import Button from "@/app/components/Button";
import { CalendarData } from "../../_type/Calendar"; // Scheduleの型を適切にインポート
import { scheduleColorMap } from "./NewPost";

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
      const dateString = selectedDate.toISOString().split("T")[0];
      const daySchedules = calendars.filter(
        (entry) => entry.scheduleDate === dateString
      );
      console.log("Filtered schedules:", daySchedules);

      setSchedules(daySchedules);
    }
  }, [selectedDate, calendars]);

  return (
    <div>
      <h2 className="text-white text-2xl">
        {selectedDate?.toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          weekday: "short",
        })}
      </h2>
      <div className="space-y-2">
        {schedules.length > 0 ? (
          schedules.map((entry) => {
            const colorCode = Object.keys(scheduleColorMap).find(
              (key) => scheduleColorMap[key] === entry.scheduleColor
            );
            return (
              <p
                key={entry.id}
                style={{ color: colorCode }}
                className="text-[10px]"
              >
                {entry.content}
              </p>
            );
          })
        ) : (
          <p>予定がありません。</p>
        )}
      </div>
      <div onClick={closeModal} className="mt-8">
        <Button text="閉じる" />
      </div>
    </div>
  );
};

export default AllSchedule;
