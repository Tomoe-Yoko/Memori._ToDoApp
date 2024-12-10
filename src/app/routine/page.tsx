"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Routine } from "../_type/WeeklyRoutine";
import { useSupabaseSession } from "../_hooks/useSupabaseSession";
import { Weekly } from "@prisma/client";
import PlusButton from "../_components/PlusButton";
import Navigation from "../_components/Navigation";
import AllClearButton from "./_components/AllClearButton";
import { useReward } from "react-rewards";
import toast from "react-hot-toast";
import Loading from "../loading";
import WeekdaySelect from "./_components/WeekdaySelect";
import RoutineList from "./_components/RoutineList";

const Page: React.FC = () => {
  const { token } = useSupabaseSession();
  const [currentDay, setCurrentDay] = useState<Weekly>(Weekly.mon);
  const [routineList, setRoutineList] = useState<Routine[]>([]);
  const [newRoutine, setNewRoutine] = useState<string>("");
  const [isSetNewRoutine, setIsSetNewRoutine] = useState(false);
  const [loading, setLoading] = useState(false);
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
  const { reward, isAnimating } = useReward("rewardId", "balloons"); //風船

  // サーバーから特定の曜日のデータを取得
  const fetcher = useCallback(
    async (day: Weekly) => {
      setLoading(true);
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
      } finally {
        setLoading(false);
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

  /////DELETE
  const deleteRoutine = async (id: number) => {
    if (!token) return;
    if (!confirm("一つのリストを削除しますか？")) return;
    try {
      const response = await fetch(`/api/weekly_routine/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
      });
      if (response.ok) {
        fetcher(currentDay);
        //削除したアイテム以外を表示(GET)
      } else {
        console.error("Failed to delete item");
        toast.error("削除に失敗しました。", {
          duration: 2100,
        });
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(`${error}:削除できませんでした。`, {
        duration: 2100,
      });
    }
  };

  //ルーティン内容更新
  const updateRoutine = async (id: number, value: string) => {
    if (!token) return;
    try {
      const response = await fetch(`/api/weekly_routine/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ routineContent: value, weekly: currentDay }),
      });
      if (!response.ok) {
        console.error("Failed to update routine.");
      }
    } catch (error) {
      console.error("Error updating routine:", error);
    }
  };

  //チェック機能
  const toggleCompletion = async (id: number) => {
    if (!token) return;
    const isCheckedRoutines = routineList.map((item) =>
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    );
    setRoutineList(isCheckedRoutines); //チェック項目が更新された配列を表示
    const updatedRoutine = isCheckedRoutines.find((item) => item.id === id);
    try {
      const response = await fetch(`/api/weekly_routine/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify(updatedRoutine),
      });
      if (!response.ok) {
        console.error("Failed to save routine.");
      }
    } catch (error) {
      console.error("Error saving routine:", error);
    }
  };

  // すべてのチェックを外す関数
  // 現在の曜日のルーティンがすべてチェックされているか確認
  const allChecked =
    routineList.length > 0 && //routineListが空でないことを確認
    routineList
      .filter((item) => item.weekly === currentDay)
      .every((item) => item.isChecked);

  const clearAllChecks = async () => {
    if (!token) return;

    // 一つでもチェックが外れている場合は、何もせずにリターン
    if (!allChecked) {
      return;
    }
    setRoutineList((prev) =>
      prev.map((item) =>
        item.weekly === currentDay ? { ...item, isChecked: false } : item
      )
    );

    try {
      const routineIds = routineList.map((routine) => routine.id);
      const response = await fetch(`/api/weekly_routine`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ routineIds, day: currentDay }), //routineIdsを送信
      });
      if (response.ok) {
        toast.success(
          <span>
            今日もルーティン完了！
            <br />
            おつかれさまでした。
          </span>,
          {
            duration: 2100, //ポップアップ表示時間
          }
        );
        reward(); // アニメーションを実行
      }
    } catch (error) {
      console.error("Error check routines:", error);
    }
  };
  if (loading) return <Loading />;
  return (
    <div>
      <div>
        <h2 className="text-white text-2xl text-center">Routine work.</h2>
        <WeekdaySelect currentDay={currentDay} setCurrentDay={setCurrentDay} />
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg mb-2 text-text_button">
            {days.find((day) => day.key === currentDay)?.label}
          </h2>
          <RoutineList
            toggleCompletion={toggleCompletion}
            isSetNewRoutine={isSetNewRoutine}
            routineList={routineList}
            setRoutineList={setRoutineList}
            updateRoutine={updateRoutine}
            deleteRoutine={deleteRoutine}
            inputRef={inputRef}
            newRoutine={newRoutine}
            setNewRoutine={setNewRoutine}
            addRoutine={addRoutine}
          />
          <div className="py-11 relative">
            <AllClearButton
              clearAllChecks={clearAllChecks}
              isAnimating={isAnimating}
              allChecked={allChecked}
            />
            <span id="rewardId" className="px-52" />
          </div>
          <PlusButton handleAddEvent={addEmptyRoutine} />
        </div>
        <Navigation />
      </div>
    </div>
  );
};
export default Page;
