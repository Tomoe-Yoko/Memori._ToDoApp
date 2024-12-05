//////追加後のレイアウト整える。チェックのマーク付ける
"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Routine } from "../_type/WeeklyRoutine";
import { useSupabaseSession } from "../_hooks/useSupabaseSession";
import { Weekly } from "@prisma/client";
import { BsTrash3Fill } from "react-icons/bs";
import PlusButton from "../_components/PlusButton";
import Navigation from "../_components/Navigation";

const Page: React.FC = () => {
  const { token } = useSupabaseSession();
  const [currentDay, setCurrentDay] = useState<Weekly>(Weekly.mon);
  const [routineList, setRoutineList] = useState<Routine[]>([]);
  const [newRoutine, setNewRoutine] = useState<string>("");
  const [isSetNewRoutine, setIsSetNewRoutine] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const days = [
    { key: Weekly.mon, label: "Monday.（月よう日）" },
    { key: Weekly.tue, label: "Tuesday.（火よう日）" },
    { key: Weekly.wed, label: "Wednesday.（水よう日）" },
    { key: Weekly.thu, label: "Thursday.（木よう日）" },
    { key: Weekly.fri, label: "Friday.（金よう日）" },
    { key: Weekly.sat, label: "Saturday.（土よう日）" },
    { key: Weekly.sun, label: "Sunday.（日よう日）" },
  ];

  // サーバーから特定の曜日のデータを取得
  const fetcher = useCallback(
    async (day: Weekly) => {
      try {
        const response = await fetch(`/api/weekly_routine/${day}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token!,
          },
        });
        const result = await response.json();
        // APIがオブジェクトでデータを返している
        const data = Array.isArray(result) ? result : result.routineWork;
        if (Array.isArray(data)) {
          setRoutineList(data);
        } else {
          console.error("Fetched data is not an array:", data);
          setRoutineList([]); // デフォルトで空の配列を設定
        }
      } catch (error) {
        console.error("Error fetching routines:", error);
        setRoutineList([]); // デフォルトで空の配列を設定
      }
    },
    [token]
  );

  // 初回レンダリングおよび曜日が変更された際にデータを取得
  useEffect(() => {
    if (!token) return;
    fetcher(currentDay);
  }, [currentDay, token, fetcher]);
  const addEmptyRoutine = () => {
    setIsSetNewRoutine(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  //新しいルーティンを追加
  const addRoutine = async () => {
    if (!token || !newRoutine.trim()) return setIsSetNewRoutine(false);
    try {
      const response = await fetch("/api/weekly_routine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
        body: JSON.stringify({
          weekly: currentDay,
          routineContent: newRoutine,
          isChecked: false,
        }),
      });
      if (response.ok) {
        setNewRoutine("");
        setIsSetNewRoutine(false);
        fetcher(currentDay);
      } else {
        console.error("Failed to add the routine.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const deleteRoutine = (id: number) => {
    setRoutineList((prev) => prev.filter((item) => item.id !== id));
  };
  return (
    <div>
      <h2 className="text-white text-2xl text-center">Routine work.</h2>
      <div className="w-11/12 mx-auto my-4 flex justify-between mb-4">
        {days.map((day) => (
          <button
            key={day.key}
            onClick={() => setCurrentDay(day.key)}
            className={`w-11 h-11 rounded-full ${
              currentDay === day.key
                ? "bg-text_button text-white"
                : "bg-white text-text_button"
            }`}
          >
            {day.label.split("（")[1].replace("よう日）", "")}
          </button>
        ))}
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg mb-2 text-text_button">
          {days.find((day) => day.key === currentDay)?.label}
        </h2>
        <ul className="space-y-2">
          {routineList.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between border-b pb-2"
            >
              <span className="flex-1 px-2">{item.routineContent}</span>
              <button
                onClick={() => deleteRoutine(item.id)}
                className="text-white bg-trash_bg p-2 rounded-full"
              >
                <BsTrash3Fill size={14} />
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center">
          {isSetNewRoutine && (
            <li className="flex w-[95%] m-auto py-1 text-lg text-text_button">
              <div className="flex items-center justify-center w-[20rem]  ml-4">
                <button
                  className={`w-7 h-7 rounded-full border-2 flex justify-center items-center "border-text_button`}
                >
                  <span className="text-white ">✓</span>
                </button>
                <input
                  placeholder="新しいタスクを入力"
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
          <PlusButton handleAddEvent={addEmptyRoutine} />
        </div>
      </div>
      <Navigation />
    </div>
  );
};
export default Page;
