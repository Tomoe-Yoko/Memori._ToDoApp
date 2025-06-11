"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TbHandGrab } from "react-icons/tb";

type Props = {
  id: number;
  toDoItem: string;
};

export const SortableItem: React.FC<Props> = ({ id, toDoItem }) => {
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
      className="w-[80%] mx-auto flex items-center p-2 border-b text-text_button hover:bg-gray-100 cursor-grab active:cursor-grabbing"
    >
      <span
        {...listeners}
        className="cursor-grab mr-2 text-3xl text-indigo-500"
      >
        <TbHandGrab />
      </span>
      <span className="">{toDoItem}</span>
    </li>
  );
};

// export default SortableItem;
