import { CreateTodoItemRequestBody } from "@/app/_type/Todo";
import React, { RefObject, useState } from "react";
import { BsTrash3Fill } from "react-icons/bs"; // アイコンをインポート

interface Props {
  id: number;
  toDoItem: string;
  isChecked: boolean;
  toggleCompletion: (id: number) => void;
  inputRef: RefObject<HTMLInputElement>; // 入力欄へのフォーカス用
  updateItem: (id: number, value: string) => void; // リアルタイム更新
  saveItem: (id: number) => void; // 保存処理
  todoItems: CreateTodoItemRequestBody[];
  deleteItem: (id: number) => void; // アイテム削除用の関数
}

const Items: React.FC<Props> = ({
  id,
  toDoItem,
  isChecked,
  toggleCompletion,
  inputRef,
  updateItem,
  saveItem,
  todoItems,
  deleteItem,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <>
      {" "}
      {todoItems.length > 0 ? (
        <li
          key={id}
          className="flex items-center justify-center space-x-2 w-[95%] max-w-md m-auto py-1"
        >
          <button
            onClick={() => toggleCompletion(id)}
            className={`w-6 h-6 rounded-full border-2 flex justify-center items-center  ${
              isChecked
                ? "bg-text_button border-text_button "
                : "border-text_button"
            }`}
          >
            {isChecked && <span className="text-white ">✓</span>}
          </button>
          <input
            ref={toDoItem === "" ? inputRef : null} // 空のタスクの場合のみフォーカス
            type="text"
            value={toDoItem}
            onChange={(e) => updateItem(id, e.target.value)}
            onFocus={() => setIsFocused(true)} // フォーカス時
            onBlur={() => {
              saveItem(id);
              setIsFocused(false);
            }} // フォーカスが外れたら保存,ごみ箱マーク非表示
            placeholder="新しいタスクを入力"
            className="px-2 py-1 border-b-2 w-[80%] focus:outline-none"
          />
          {(isFocused || toDoItem.trim() !== "") && (
            <button
              onClick={() => deleteItem(id)}
              className="text-white bg-trash_bg p-2 rounded-full"
            >
              <BsTrash3Fill size={14} />
            </button>
          )}
        </li>
      ) : (
        <li className="text-center text-gray-500">アイテムがありません。</li>
      )}
    </>
  );
};

export default Items;
