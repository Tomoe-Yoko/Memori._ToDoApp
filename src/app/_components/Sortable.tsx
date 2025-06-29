"use Client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaRegHand } from "react-icons/fa6";
import { FaRegHandRock } from "react-icons/fa";

interface Props {
  id: number | string;
  children: React.ReactNode;
  className?: string;
}

export const Sortable: React.FC<Props> = ({ id, children, className = "" }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <>
      {isDragging ? <FaRegHandRock /> : <FaRegHand />}
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`cursor-grab active:cursor-grabbing touch-none ${className}`}
      >
        {children}
      </div>
    </>
  );
};
