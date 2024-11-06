"use client";
import React, { useState, useEffect } from "react";
import { useSupabaseSession } from "../_hooks/useSupabaseSession";
import Calendar from "react-calendar";
import { ScheduleColor } from "@prisma/client";
import { CalendarData } from "../_type/Calendar";
import Modal from "react-modal";
import NewPost from "./_modal/NewPost";
import AllSchedule from "./_modal/AllSchedule";
import { scheduleColorMap } from "./_modal/NewPost";
import Button from "../components/Button";
import Navigation from "../components/Navigation";
import toast, { Toaster } from "react-hot-toast";
import "react-calendar/dist/Calendar.css";
import "../../app/globals.css";

const Page: React.FC = () => {
  const { token } = useSupabaseSession();
  const [calendars, setCalendars] = useState<CalendarData[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [addScheduleModal, setAddScheduleModal] = useState<boolean>(false);
  const [showAllScheduleModal, setShowAllScheduleModal] = useState(false);

  useEffect(() => {
    if (!token) return;
    const fetcher = async () => {
      const res = await fetch("/api/calendar", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const { calendars } = await res.json();
      setCalendars(calendars);
    };
    fetcher();
  }, [token]);

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
      // console.error("Error deleting schedule:", error);
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
      const dateString = date.toLocaleDateString("ja-JP");
      const calendarEntries = calendars.filter((entry) => {
        const entryDateString = new Date(entry.scheduleDate).toLocaleDateString(
          "ja-JP"
        );
        return entryDateString === dateString;
      });

      if (calendarEntries.length > 2) {
        return (
          <div className="flex flex-col items-start">
            {calendarEntries.slice(0, 2).map((entry) => {
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
            })}
            <p className="text-[10px] text-gray-500">
              ほか{calendarEntries.length - 2}件
            </p>
          </div>
        );
      } else if (calendarEntries.length > 0) {
        return (
          <div className="flex flex-col items-start">
            {calendarEntries.map((entry) => {
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
            })}
          </div>
        );
      } else {
        return null;
      }
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
    if (!token) return;
    const fetcher = async () => {
      const res = await fetch("/api/calendar", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const { calendars } = await res.json();
      setCalendars(calendars);
    };
    fetcher();
  };

  return (
    <div className="relative">
      <h2 className="text-white text-2xl text-center">Calendar.</h2>
      <Calendar
        locale="ja-JP"
        prev2Label={null}
        next2Label={null}
        formatDay={(_, date) => date.getDate().toString()}
        formatMonthYear={(_, date) =>
          `${date.getFullYear()}.${date.getMonth() + 1}`
        }
        formatShortWeekday={(_, date) =>
          ["日", "月", "火", "水", "木", "金", "土"][date.getDay()]
        }
        tileContent={tileContent}
        onClickDay={onCalendarClick}
        className={"react-calendar"}
      />
      <div className="flex justify-end mr-4 pb-20">
        <button
          onClick={() => setAddScheduleModal(true)}
          className="block w-[55px] aspect-square rounded-full bg-text_button text-white text-xl mt-2"
        >
          ＋
        </button>
      </div>
      <Navigation />
      <Toaster position="top-center" />
      <Modal
        isOpen={addScheduleModal} //closeModal
        onRequestClose={() => setAddScheduleModal(false)}
        className="bg-001 p-16 max-w-lg mx-auto mt-24 rounded shadow-lg" //モーダルの外でクローズ
        overlayClassName="absolute top-0 w-full bg-black bg-opacity-50 flex justify-center items-center"
      >
        <NewPost onSuccess={handleSuccess} initialDate={new Date()} />
        <div onClick={() => setAddScheduleModal(false)} className="mt-8">
          <Button text="キャンセル" />
        </div>
      </Modal>
      <Modal
        isOpen={showAllScheduleModal}
        onRequestClose={() => setShowAllScheduleModal(false)}
        className=" bg-001 p-16 max-w-lg mx-auto mt-24 rounded shadow-lg"
        overlayClassName="absolute inset-0 w-full h-max min-h-screen bg-black bg-opacity-50 flex justify-center items-center"
      >
        <AllSchedule
          selectedDate={selectedDate}
          closeModal={() => setShowAllScheduleModal(false)}
          calendars={calendars}
          handleDeleteSchedule={handleDeleteSchedule}
          handleUpdateSchedule={handleUpdateSchedule}
        />
        <Toaster position="top-center" />
      </Modal>
    </div>
  );
};

export default Page;
