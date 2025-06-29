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
  isSortMode?: boolean; // 並べ替えモードかどうか
}

export const Sortable: React.FC<Props> = ({
  id,
  children,
  className = "",
  isSortMode = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  // const style: React.CSSProperties = {
  //   transform: CSS.Transform.toString(transform),
  //   transition,
  //   touchAction: "manipulation", // ← これ重要！
  //   userSelect: isDragging ? "none" : "auto",
  //   pointerEvents: isDragging ? "none" : "auto", // ← これも追加！
  // };

  return (
    <>
      {isSortMode && (isDragging ? <FaRegHandRock /> : <FaRegHand />)}{" "}
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        // 並べ替えモードのときだけリスナーを適用
        {...(isSortMode ? listeners : {})}
        className={`flex items-center gap-1 cursor-default ${
          isSortMode ? "cursor-grab active:cursor-grabbing" : ""
        } ${className}`}
      >
        {children}
      </div>
    </>
  );
};
