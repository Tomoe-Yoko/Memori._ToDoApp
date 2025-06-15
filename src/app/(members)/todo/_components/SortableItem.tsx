"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaRegHand } from "react-icons/fa6";
import { FaRegHandRock } from "react-icons/fa";

type Props = {
  id: number;
  toDoItem: string;
  isChecked: boolean; // オプションとしてisCheckedを追加
};

export const SortableItem: React.FC<Props> = ({ id, toDoItem, isChecked }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

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
      className="w-[85%] mx-auto flex items-center p-2 border-b text-text_button hover:bg-gray-100 cursor-grab active:cursor-grabbing touch-none"
    >
      <span className="cursor-grab mr-2 text-2xl text-indigo-500">
        {isDragging ? <FaRegHandRock /> : <FaRegHand />}
      </span>
      <button
        className={`w-6 h-6 rounded-full border-2 flex justify-center items-center  ${
          isChecked
            ? "bg-text_button border-text_button "
            : "border-text_button"
        }`}
      >
        {isChecked && <span className="text-white ">✓</span>}
      </button>
      <span className="w-[75%] ml-2">{toDoItem}</span>
    </li>
  );
};
