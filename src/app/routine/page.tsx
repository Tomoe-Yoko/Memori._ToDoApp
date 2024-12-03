"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Routine } from "../_type/WeeklyRoutine";
import { useSupabaseSession } from "../_hooks/useSupabaseSession";
//import PlusButton from "../_components/PlusButton";
// import { supabase } from "@/utils/supabase";

const page: React.FC = () => {
  const { token } = useSupabaseSession();
  const [currentDay, setCurrentDay] = useState<string>("mon"); //選択中の曜日
  const [routineList, setRoutineList] = useState<Routine[]>([]); // 現在表示中の曜日のルーティン
  const [newRoutine, setNewRoutine] = useState<string>("");

  const days = [
    { key: "mon", label: "月" },
    { key: "tue", label: "火" },
    { key: "wed", label: "水" },
    { key: "thu", label: "木" },
    { key: "fri", label: "金" },
    { key: "sat", label: "土" },
    { key: "sun", label: "日" },
  ];
  // サーバーから特定の曜日のデータを取得
  const fetcher = useCallback(
    async (day: string) => {
      try {
        const response = await fetch(`/api/routines?day=${day}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token!,
          },
        });
        const data: Routine[] = await response.json();
        setRoutineList(data);
      } catch (error) {
        console.error("Error fetching routines:", error);
      }
    },
    [token]
  );
  // 初回レンダリングおよび曜日が変更された際にデータを取得
  useEffect(() => {
    if (!token) return;
    fetcher(currentDay);
  }, [fetcher, token]);

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
      {/* <PlusButton handleAddEvent={} /> */}
    </div>
  );
};

export default page;
