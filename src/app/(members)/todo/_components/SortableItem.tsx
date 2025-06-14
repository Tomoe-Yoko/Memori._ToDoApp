"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TbHandGrab } from "react-icons/tb";

type Props = {
  id: number;
  toDoItem: string;
  isChecked: boolean; // オプションとしてisCheckedを追加
};

export const SortableItem: React.FC<Props> = ({ id, toDoItem, isChecked }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="w-[80%] mx-auto flex items-center p-2 border-b text-text_button hover:bg-gray-100 cursor-grab active:cursor-grabbing"
    >
      <span className="cursor-grab mr-2 text-3xl text-indigo-500">
        <TbHandGrab />
      </span>
      <button
        className={`block w-7 h-7 rounded-full border-2 flex justify-center items-center  ${
          isChecked
            ? "bg-text_button border-text_button "
            : "border-text_button"
        }`}
      >
        {isChecked && <span className="text-white ">✓</span>}
      </button>
      <span className="w-[70%] ml-2">{toDoItem}</span>
    </li>
  );
};
