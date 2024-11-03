"use client";
import React, { useState, useEffect } from "react";
import Button from "@/app/components/Button";
import { CalendarData } from "../../_type/Calendar"; // Scheduleの型を適切にインポート
import { scheduleColorMap } from "./NewPost";
import CloseButton from "@/app/components/CloseButton";
import { BsTrash3Fill } from "react-icons/bs"; // アイコンをインポート
interface Props {
  selectedDate: Date | null;
  closeModal: () => void;
  calendars: CalendarData[]; // 親コンポーネントから予定を受け取る
  onDeleteSchedule: (id: number) => void;
  onUpdateSchedule: (id: number, newContent: string) => void;
}

const AllSchedule: React.FC<Props> = ({
  selectedDate,
  closeModal,
  calendars,
  onDeleteSchedule,
  onUpdateSchedule,
}) => {
  const [schedules, setSchedules] = useState<CalendarData[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");

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

  //編集
  const handleEdit = (id: number, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };
  const handleSave = (id: number) => {
    onUpdateSchedule(id, editContent);
    setEditingId(null);
  };
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
              <>
                <div
                  key={entry.id}
                  className="flex items-center justify-between space-x-4"
                >
                  {editingId === entry.id ? (
                    <input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="flex-grow p-1 border rounded"
                      onBlur={() => handleSave(entry.id)}
                    />
                  ) : (
                    <p
                      onClick={() => handleEdit(entry.id, entry.content)}
                      style={{ color: colorCode }}
                      className="text-base cursor-pointer "
                    >
                      {entry.content}
                    </p>
                  )}
                  <button
                    onClick={() => onDeleteSchedule(entry.id)}
                    className="text-white bg-trash_bg p-2 rounded-full"
                  >
                    <BsTrash3Fill size={14} />
                  </button>
                </div>
                <hr />
              </>
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
