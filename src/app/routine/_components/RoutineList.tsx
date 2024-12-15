import React from "react";
import { BsTrash3Fill } from "react-icons/bs";
import { Toaster } from "react-hot-toast";
import { Routine } from "@/app/_type/WeeklyRoutine";

interface RoutineListProps {
  toggleCompletion: (id: number) => Promise<void>;
  isSetNewRoutine: boolean;
  routineList: Routine[];
  setRoutineList: React.Dispatch<React.SetStateAction<Routine[]>>;
  updateRoutine: (id: number, value: string) => Promise<void>;
  deleteRoutine: (id: number) => Promise<void>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  newRoutine: string;
  setNewRoutine: React.Dispatch<React.SetStateAction<string>>;
  addRoutine: () => Promise<void>;
}

const RoutineList: React.FC<RoutineListProps> = ({
  toggleCompletion,
  isSetNewRoutine,
  routineList,
  setRoutineList,
  updateRoutine,
  deleteRoutine,
  inputRef,
  newRoutine,
  setNewRoutine,
  addRoutine,
}) => {
  return (
    <ul className="space-y-2">
      {routineList.map((item) => (
        <li
          key={item.id}
          className="flex w-[90%] mx-auto py-1 text-lg text-text_button"
        >
          <div className="flex items-center w-full min-w-[300px] mX-auto mb-1 ml-2">
            <button
              onClick={() => toggleCompletion(item.id)}
              className={`w-7 h-7 rounded-full border-2 flex justify-center items-center  ${
                item.isChecked
                  ? "bg-text_button border-text_button "
                  : "border-text_button"
              }`}
            >
              {item.isChecked && <span className="text-white ">✓</span>}
            </button>
            <input
              value={item.routineContent}
              onChange={(e) =>
                setRoutineList((prev) =>
                  prev.map((routine) =>
                    routine.id === item.id
                      ? { ...routine, routineContent: e.target.value }
                      : routine
                  )
                )
              }
              onBlur={() => updateRoutine(item.id, item.routineContent)}
              className="flex px-2 w-[85%]  border-b-2 focus:outline-none"
            />
            {item.isChecked && (
              <button
                onClick={() => deleteRoutine(item.id)}
                className="text-white bg-trash_bg p-2 rounded-full"
              >
                <BsTrash3Fill size={14} />
              </button>
            )}
          </div>
          <Toaster position="top-center" />
        </li>
      ))}
      {isSetNewRoutine && (
        <li className="flex w-[90%] m-auto py-1 text-lg text-text_button">
          <div className="flex items-center w-full min-w-[300px] mX-auto ml-2">
            <button
              className={`w-7 h-7 rounded-full border-2 flex justify-center items-center border-text_button`}
            ></button>
            <input
              placeholder="新しいルーティンを入力"
              ref={inputRef}
              type="text"
              value={newRoutine}
              onChange={(e) => setNewRoutine(e.target.value)}
              onBlur={addRoutine}
              className="px-2 py-1 border-b-2 w-[85%] focus:outline-none "
            />
          </div>
        </li>
      )}
    </ul>
  );
};

export default RoutineList;
