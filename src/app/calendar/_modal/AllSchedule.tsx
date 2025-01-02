"use client";
import React, { useState, useEffect } from "react";
import Button from "@/app/_components/Button";
import { CalendarData } from "../../_type/Calendar"; // Scheduleの型を適切にインポート
import { ScheduleColor } from "@prisma/client";
import { scheduleColorMap } from "./NewPost";
import CloseButton from "@/app/_components/CloseButton";
import { BsTrash3Fill } from "react-icons/bs"; // アイコンをインポート
import Modal from "react-modal"; // モーダルをインポート
import NewPost from "./NewPost"; // NewPostコンポーネントをインポート

interface Props {
  selectedDate: Date | null;
  closeModal: () => void;
  calendars: CalendarData[]; // 親コンポーネントから予定を受け取る
  handleDeleteSchedule: (id: number) => void;
  handleSuccess: () => void;
  handleUpdateSchedule: (
    id: number,
    newContent: string,
    scheduleDate: string,
    scheduleColor: ScheduleColor,
    createdAt: string,
    updatedAt: string
  ) => void;
}

const AllSchedule: React.FC<Props> = ({
  selectedDate,
  closeModal,
  calendars,
  handleDeleteSchedule,
  handleUpdateSchedule,
  handleSuccess,
}) => {
  const [schedules, setSchedules] = useState<CalendarData[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [addModalOpen, setAddModalOpen] = useState(false); //スケジュール追加のモーダル開閉状態

  //GET
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

  //PUT
  const handleEdit = (id: number, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };
  const handleSave = (id: number) => {
    const schedule = schedules.find((entry) => entry.id === id);
    if (!schedule) return;

    handleUpdateSchedule(
      id,
      editContent,
      new Date(schedule.scheduleDate).toISOString(), // 更新日時は現在の日時を使用
      schedule.scheduleColor,
      new Date(schedule.createdAt).toISOString(), // Date型をstring型に変換
      new Date().toISOString()
    );
    setEditingId(null);
  };
  return (
    <div className="relative ">
      <div className="absolute top-[-40px] right-[-30px]">
        <CloseButton onClick={closeModal} />
      </div>
      <h2 className="text-text_button text-2xl py-4">
        {selectedDate?.toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          weekday: "short",
        })}
      </h2>
      <div className="space-y-2 bg-[#ccca] rounded-xl p-4 leading-normal">
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
                    onClick={() => handleDeleteSchedule(entry.id)}
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
      <div
        onClick={() => {
          console.log(selectedDate);

          setAddModalOpen(true);
        }}
        className="mt-8"
      >
        <Button text="追加" />
      </div>
      <div onClick={closeModal} className="mt-8">
        <Button text="閉じる" />
      </div>
      <Modal
        isOpen={addModalOpen}
        onRequestClose={() => setAddModalOpen(false)}
        className="bg-white p-16 max-w-lg mx-auto mt-24 rounded shadow-lg"
        overlayClassName="absolute top-0 w-full bg-black bg-opacity-50 flex justify-center items-center"
      >
        {/* <NewPost onSuccess={() => setAddModalOpen(false)} /> */}
        {selectedDate && (
          <NewPost
            onSuccess={() => {
              handleSuccess(); // 予定が登録された後の処理
              setAddModalOpen(false);
              setAddModalOpen(false); // モーダルを閉じる
            }}
            initialDate={selectedDate} // 選択された日付を渡す
          />
        )}{" "}
        {/* <div onClick={() => setShowAllScheduleModal(true)} className="mt-8">
          <Button text="キャンセル" />
        </div> */}
      </Modal>
    </div>
  );
};

export default AllSchedule;
