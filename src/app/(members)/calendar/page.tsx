"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSupabaseSession } from "../../_hooks/useSupabaseSession";
import Calendar from "react-calendar";
import { ScheduleColor } from "@prisma/client";
import { CalendarData } from "../../_type/Calendar";
import Modal from "react-modal";
import NewPost from "./_components/modals/NewPost";
import AllSchedule from "./_components/modals/AllSchedule";
import { scheduleColorMap } from "./_components/modals/NewPost";
import Navigation from "../../_components/Navigation";
import toast, { Toaster } from "react-hot-toast";
import "react-calendar/dist/Calendar.css";
import "../../globals.css";
import PlusButton from "../../_components/PlusButton";
import Loading from "@/app/loading";
import { useUser } from "@/app/_hooks/useUser";
// import { mutate } from "swr";

const Page: React.FC = () => {
  const { token } = useSupabaseSession();
  const [calendars, setCalendars] = useState<CalendarData[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [addScheduleModal, setAddScheduleModal] = useState<boolean>(false);
  const [showAllScheduleModal, setShowAllScheduleModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [startOfWeek, setStartOfWeek] = useState<"gregory" | "iso8601">(
    "iso8601"
  );
  const [holidays, setHolidays] = useState<Record<string, string>>({}); // 祝日データ
  const { mutate } = useUser();
  const fetcher = useCallback(async () => {
    const res = await fetch("/api/calendar", {
      headers: {
        "Content-Type": "application/json",
        Authorization: token!,
      },
    });

    if (res.ok) {
      const { calendars } = await res.json();
      setCalendars(calendars);
    } else {
      console.error("Empty response body");
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    setLoading(false);
    fetcher();
    mutate();
    // mutate("api/users");
    // 週の始まりを取得
    const fetchStartOfWeek = async () => {
      const res = await fetch("/api/users", {
        headers: { Authorization: token! },
      });
      if (res.ok) {
        const data = await res.json();
        setStartOfWeek(data.userData.startOfWeek || "iso8601");
      }
    };

    fetchStartOfWeek();
  }, [fetcher, token, mutate]);

  // 祝日データの取得
  useEffect(() => {
    const fetchHolidays = async () => {
      const res = await fetch("https://holidays-jp.github.io/api/v1/date.json");
      if (res.ok) {
        const holidayData = await res.json();
        setHolidays(holidayData);
      }
    };
    fetchHolidays();
  }, []);

  //DELETE
  const handleDeleteSchedule = async (id: number) => {
    if (!confirm("予定を削除しますか？")) return;
    if (!token) return;
    try {
      const response = await fetch(`/api/calendar/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: token },
      });
      if (response.ok) {
        toast.success("予定を削除しました。", {
          duration: 2100, //ポップアップ表示時間
        });
        setCalendars(
          (prevCalendars) =>
            prevCalendars.filter((calendar) => calendar.id !== id) //`calendar.id`が削除したい`id`と一致しない場合に`true`を返す。
        );
      } else {
        toast.error("削除に失敗しました。", {
          duration: 2100,
        });
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
      toast.error(`${error}:削除できませんでした。`, {
        duration: 2100,
      });
    }
  };

  //PUT
  const handleUpdateSchedule = async (
    id: number,
    newContent: string,
    scheduleDate: string,
    scheduleColor: ScheduleColor,
    createdAt: string,
    updatedAt: string
  ) => {
    if (!token) return;

    try {
      const response = await fetch(`/api/calendar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({
          scheduleDate: new Date(scheduleDate).toISOString(),
          content: newContent,
          scheduleColor: scheduleColor,
          createdAt: new Date(createdAt).toISOString(),
          updatedAt: new Date(updatedAt).toISOString(),
        }),
      });
      if (response.ok) {
        toast.success("予定を更新しました。", {
          duration: 2100, //ポップアップ表示時間
        });
        setCalendars((prevCalendars) =>
          prevCalendars.map((calendar) =>
            calendar.id === id ? { ...calendar, content: newContent } : calendar
          )
        );
      } else {
        const errorData = await response.json();
        console.error("Failed to update schedule:", errorData.message);
        toast.error("更新に失敗しました。", {
          duration: 2100,
        });
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast.error("更新できませんでした。", {
        duration: 2100,
      });
    }
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const jstDateString = date
        .toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\//g, "-"); // "2025/01/01" → "2025-01-01"

      const holidayName = holidays[jstDateString];

      const calendarEntries = calendars.filter((entry) => {
        const entryDate = new Date(entry.scheduleDate);
        const entryDateString = entryDate
          .toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(/\//g, "-");

        return entryDateString === jstDateString;
      });

      // 予定の表示部分を構成
      const scheduleElements = (
        calendarEntries.length > 2
          ? calendarEntries.slice(0, 3)
          : calendarEntries
      ).map((entry) => {
        const colorCode = Object.keys(scheduleColorMap).find(
          (key) => scheduleColorMap[key] === entry.scheduleColor
        );
        return (
          <p
            key={entry.id}
            style={{ color: colorCode }}
            className="text-[10px]"
          >
            ・{entry.content}
          </p>
        );
      });

      // 祝日がある場合は先頭に追加
      if (holidayName) {
        scheduleElements.unshift(
          <p key="holiday" className="text-gray-500">
            * {holidayName}
          </p>
        );
      }

      // 表示内容があれば返す
      if (scheduleElements.length > 0) {
        return (
          <div className="flex flex-col items-start">
            {scheduleElements}
            {calendarEntries.length > 3 && (
              <p className="text-[10px] text-gray-500">
                ほか{calendarEntries.length - 3}件
              </p>
            )}
          </div>
        );
      }

      return null;
    }
  };

  const onCalendarClick = (value: Date) => {
    setSelectedDate(value);
    setShowAllScheduleModal(true);
  };

  const handleSuccess = () => {
    setAddScheduleModal(false); //モーダルクローズ
    toast.success("予定が登録されました！", {
      duration: 2100,
    }); //ポップアップ表示時間
    //GET(リロード)
    fetcher(); //useCallbackで書いた内容（token情報は不要）
  };

  if (loading) {
    return <Loading />;
  }
  // 土曜と日曜の日付の色変更
  const tileClassName = ({ date }: { date: Date }) => {
    const day = date.getDay(); // 0: 日曜日, 1: 月曜日, ..., 6: 土曜日
    if (day === 0) return "react-calendar__month-view__days__day--sunday"; // 日曜日
    if (day === 6) return "react-calendar__month-view__days__day--saturday"; // 土曜日
    return null; // その他の日はクラスを追加しない
  };
  return (
    <div className="relative">
      <h2 className="text-white text-2xl text-center">Calendar.</h2>
      <div className="pb-[70px]">
        <Calendar
          locale="ja-JP"
          calendarType={startOfWeek} // ここで変更
          prev2Label={null}
          next2Label={null}
          formatDay={(_, date) => date.getDate().toString()}
          formatMonthYear={(_, date) =>
            `${date.getFullYear()}.${date.getMonth() + 1}`
          }
          formatShortWeekday={(_, date) =>
            ["日", "月", "火", "水", "木", "金", "土"][date.getDay()]
          }
          tileClassName={tileClassName}
          tileContent={tileContent}
          onClickDay={onCalendarClick}
          className={"react-calendar"}
        />
      </div>

      <PlusButton handleAddEvent={() => setAddScheduleModal(true)} />

      <Navigation />
      <Toaster position="top-center" />
      <Modal
        isOpen={addScheduleModal} //closeModal
        onRequestClose={() => setAddScheduleModal(false)}
        className="bg-white p-16 max-w-lg mx-auto mt-24 rounded shadow-lg "
        //モーダルの外でクローズ
        overlayClassName="absolute top-0 w-full bg-black bg-opacity-50 flex justify-center items-center"
      >
        <NewPost onSuccess={handleSuccess} initialDate={new Date()} />
      </Modal>
      <Modal
        isOpen={showAllScheduleModal}
        onRequestClose={() => setShowAllScheduleModal(false)}
        className=" bg-white p-16 max-w-lg mx-auto mt-24 rounded shadow-lg"
        overlayClassName="absolute inset-0 w-full h-max min-h-screen bg-black bg-opacity-50 flex justify-center items-center"
      >
        <AllSchedule
          selectedDate={selectedDate}
          closeModal={() => setShowAllScheduleModal(false)}
          calendars={calendars}
          handleDeleteSchedule={handleDeleteSchedule}
          handleUpdateSchedule={handleUpdateSchedule}
          handleSuccess={handleSuccess}
          holidays={holidays}
        />
        <Toaster position="top-center" />
      </Modal>
    </div>
  );
};

export default Page;
