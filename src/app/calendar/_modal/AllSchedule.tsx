import React from "react";
import Button from "@/app/components/Button";

interface Props {
  selectedDate: Date | null;
  closeModal: () => void;
}

const AllSchedule: React.FC<Props> = ({ selectedDate, closeModal }) => {
  return (
    <div>
      <h2>予定一覧</h2>
      <p>
        {selectedDate
          ? selectedDate.toDateString()
          : "日付が選択されていません"}
      </p>
      {/* ここに選択された日付の予定を表示するロジックを追加 */}
      <div onClick={closeModal} className="mt-8">
        <Button text="閉じる" />
      </div>
    </div>
  );
};

export default AllSchedule;
