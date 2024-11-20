import React from "react";

interface Props {
  id: number;
  toDoItem: string;
  isChecked: boolean;
  toggleCompletion: (id: number) => void;
}

const Items: React.FC<Props> = ({
  id,
  toDoItem,
  isChecked,
  toggleCompletion,
}) => {
  return (
    <li key={id} className="flex">
      <button
        onClick={() => toggleCompletion(id)}
        className={`w-6 h-6 rounded-full border-2 flex justify-center items-center text-white ${
          isChecked ? "bg-text_button border-text_button" : "border-text_button"
        }`}
      >
        {isChecked && <span className="text-white font-bold">✔️</span>}
      </button>
      <p
        className={`text-lg ${
          isChecked ? "line-through text-text_button" : "text-text_button"
        }`}
      >
        <span>{toDoItem}</span>
      </p>
    </li>
  );
};

export default Items;
