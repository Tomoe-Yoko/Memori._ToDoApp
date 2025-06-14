import { CreateTodoItemRequestBody } from "@/app/_type/Todo";
import React, { RefObject } from "react";
import { BsTrash3Fill } from "react-icons/bs";

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
  postItem: () => void;
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
  return (
    <>
      {todoItems.length > 0 ? (
        <li
          key={id}
          className="flex w-[95%] m-auto py-1 text-lg text-text_button"
        >
          <div className="flex items-center justify-center w-[20rem] mb-1 ml-4">
            <button
              onClick={() => toggleCompletion(id)}
              className={`w-7 h-7 rounded-full border-2 flex justify-center items-center  ${
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
              onBlur={() => {
                saveItem(id);
                // フォーカスが外れたら保存
              }}
              placeholder="新しいタスクを入力"
              className={`px-2 py-1 border-b-2 w-[85%] focus:outline-none ${
                toDoItem.length >= 20
                  ? "text-[10px]"
                  : toDoItem.length >= 14
                  ? "text-[13px]"
                  : "text-[1rem]"
              }`}
            />
          </div>

          {isChecked && (
            <button
              onClick={() => deleteItem(id)}
              className="w-8 h-8 text-white bg-trash_bg p-2 rounded-full"
            >
              <BsTrash3Fill size={14} />
            </button> // チェックがついたらごみ箱マーク表示
          )}
        </li>
      ) : (
        <li className="text-center text-gray-500">アイテムがありません。</li>
      )}
    </>
  );
};

export default Items;
