"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Routine } from "../_type/WeeklyRoutine";
import { useSupabaseSession } from "../_hooks/useSupabaseSession";
//import { Weekly } from "@prisma/client";
import { BsTrash3Fill } from "react-icons/bs"; // アイコンをインポート
import PlusButton from "../_components/PlusButton";

// Weekly enumを定義
enum Weekly {
  Mon = "mon",
  Tue = "tue",
  Wed = "wed",
  Thu = "thu",
  Fri = "fri",
  Sat = "sat",
  Sun = "sun",
}

const Page: React.FC = () => {
  const { token } = useSupabaseSession();
  const [currentDay, setCurrentDay] = useState<Weekly>(Weekly.Mon); //選択中の曜日
  const [routineList, setRoutineList] = useState<Routine[]>([]); // 現在表示中の曜日のルーティン
  const [newRoutine, setNewRoutine] = useState<string>("");

  const days = [
    { key: Weekly.Mon, label: "月" },
    { key: Weekly.Tue, label: "火" },
    { key: Weekly.Wed, label: "水" },
    { key: Weekly.Thu, label: "木" },
    { key: Weekly.Fri, label: "金" },
    { key: Weekly.Sat, label: "土" },
    { key: Weekly.Sun, label: "日" },
  ];
  // サーバーから特定の曜日のデータを取得
  const fetcher = useCallback(
    async (day: Weekly) => {
      try {
        const response = await fetch(`/api/weekly_routine?day=${day}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token!,
          },
        });

        // 情報が取得できてないのを解消するところから！
        const data: Routine[] = await response.json();
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

  //新しいルーティンを追加
  const addRoutine = async () => {
    if (!newRoutine.trim()) return;

    try {
      const response = await fetch("/api/weekly_routine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Weekly: currentDay,
          routineContent: newRoutine,
          isChecked: false,
        }),
      });

      if (response.ok) {
        const newRoutineItem: Routine = {
          id: routineList.length + 1,
          weekly: currentDay,
          routineContent: newRoutine,
          isChecked: false,
        };
        setRoutineList((prev) => [...prev, newRoutineItem]);
        setNewRoutine(""); // 入力フィールドをリセット
      } else {
        console.error("Failed to add the routine.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  // ルーチンを削除する関数の仮実装
  const deleteRoutine = (id: number) => {
    // 削除するロジックをここに実装
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
            {day.label}
          </button>
        ))}
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-2">
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
          <input
            type="text"
            value={newRoutine}
            onChange={(e) => setNewRoutine(e.target.value)}
            placeholder="新しいルーティンを追加"
            className="flex-1 px-2 py-1 border rounded"
          />
          {/* <button
            onClick={addRoutine}
            className="ml-2 px-3 py-2 bg-gray-800 text-white rounded"
          >
            <AiOutlinePlus />
          </button> */}
          <PlusButton handleAddEvent={addRoutine} />
        </div>
      </div>{" "}
    </div>
  );
};

export default Page;
