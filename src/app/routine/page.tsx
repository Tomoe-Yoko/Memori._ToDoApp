"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Routine } from "../_type/WeeklyRoutine";
import { useSupabaseSession } from "../_hooks/useSupabaseSession";
import { Weekly } from "@prisma/client";
import { BsTrash3Fill } from "react-icons/bs";
import PlusButton from "../_components/PlusButton";
import Navigation from "../_components/Navigation";
import AllClearButton from "./_components/AllClearButton";
import { useReward } from "react-rewards";
import toast, { Toaster } from "react-hot-toast";
import Loading from "../loading";

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
        toast.success("リストを一つを削除しました。", {
          duration: 2100, //ポップアップ表示時間
        });
        //削除したアイテム以外を表示(GET)
        fetcher(currentDay);
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
    // 現在の曜日のルーティンを取得し、isCheckedをfalseに設定
    // const allUnCheckedRoutines = routineList
    //   .filter((item) => item.weekly === currentDay)
    //   .map((item) => ({
    //     ...item,
    //     isChecked: false,
    //   }));

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
        body: JSON.stringify({ routineIds, day: currentDay }), // 修正: routineIdsを送信
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

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
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
                  className="flex w-[95%] m-auto py-1 text-lg text-text_button"
                >
                  <div className="flex items-center w-[20rem]  ml-4">
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
                <li className="flex w-[95%] m-auto py-1 text-lg text-text_button">
                  <div className="flex items-center w-[20rem]  ml-4">
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
      )}
    </div>
  );
};
export default Page;
