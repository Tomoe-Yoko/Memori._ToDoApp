import React, { RefObject } from "react";

interface Props {
  id: number;
  toDoItem: string;
  isChecked: boolean;
  toggleCompletion: (id: number) => void;
  inputRef: RefObject<HTMLInputElement>; // 入力欄へのフォーカス用
  updateItem: (id: number, value: string) => void; // リアルタイム更新
  saveItem: (id: number) => void; // 保存処理
}

const Items: React.FC<Props> = ({
  id,
  toDoItem,
  isChecked,
  toggleCompletion,
  inputRef,
  updateItem,
  saveItem,
}) => {
  return (
    <li
      key={id}
      className="flex items-center justify-center space-x-2 w-[95%] max-w-md m-auto py-1"
    >
      <button
        onClick={() => toggleCompletion(id)}
        className={`w-6 h-6 rounded-full border-2 flex justify-center items-center text-white ${
          isChecked ? "bg-text_button border-text_button" : "border-text_button"
        }`}
      >
        {isChecked && <span className="text-white font-bold">✔️</span>}
      </button>
      <input
        ref={toDoItem === "" ? inputRef : null} // 空のタスクの場合のみフォーカス
        type="text"
        value={toDoItem}
        onChange={(e) => updateItem(id, e.target.value)}
        onBlur={() => saveItem(id)} // フォーカスが外れたら保存
        placeholder="新しいタスクを入力"
        className="px-2 py-1 border-b-2 w-[80%] focus:outline-none"
      />
    </li>
  );
};

export default Items;
