// "use client";
// import React, { useState, useEffect } from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css"; // デフォルトスタイルをインポート
// import "../../app/globals.css";
// import { CalendarProps, CalendarData } from "../_type/Calendar";
// import Modal from "react-modal";
// import NewPost from "./_modal/NewPost";
// import AllSchedule from "./_modal/AllSchedule";
// import { scheduleColorMap } from "./_modal/NewPost";
// import Button from "../components/Button";
// import { useSupabaseSession } from "../_hooks/useSupabaseSession";
// import Navigation from "../components/Navigation";

// //Modal.setAppElement("#root");

// const Page: React.FC = () => {
//   const { token } = useSupabaseSession();
//   const [addScheduleModal, setAddScheduleModal] = useState(false);
//   const [calendars, setCalendars] = useState<CalendarData[]>([]);
//   const removeMonthYearSuffix = ({ date }: CalendarProps): string => {
//     return `${date.getFullYear()}.${date.getMonth() + 1}`; // 2024.10と表示
//   };
//   const removeSuffix = ({ date }: CalendarProps): string => {
//     return date.getDate().toString(); // 日付の数字だけを表示(文字列化)
//   };
//   const closeModal = () => setAddScheduleModal(false); //閉じる関数
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null); //選択された日付を管理
//   const [showAllScheduleModal, setShowAllScheduleModal] = useState(false); //日付クリックmodal管理

//   useEffect(() => {
//     if (!token) return;
//     const fetcher = async () => {
//       const res = await fetch("/api/calendar", {
//         headers: {
//           "Content-Type": "application/json", //Header に token を付与
//           Authorization: token,
//         },
//       });
//       const { calendars } = await res.json();
//       setCalendars(calendars);
//     };
//     fetcher();
//   }, [token]);
//   const tileContent = ({ date, view }: { date: Date; view: string }) => {
//     if (view === "month") {
//       const dateString = date.toLocaleDateString("ja-JP");
//       const calendarEntries = calendars.filter((entry) => {
//         const entryDateString = new Date(entry.scheduleDate).toLocaleDateString(
//           "ja-JP"
//         );

//         return entryDateString === dateString;
//       });

//       if (calendarEntries.length > 2) {
//         return (
//           <div className="flex flex-col items-start">
//             {calendarEntries.slice(0, 2).map((entry) => {
//               const colorCode = Object.keys(scheduleColorMap).find(
//                 (key) => scheduleColorMap[key] === entry.scheduleColor
//               );
//               return (
//                 <p
//                   key={entry.id}
//                   style={{ color: colorCode }}
//                   className="text-[10px]"
//                 >
//                   .{entry.content}
//                 </p>
//               );
//             })}
//             <p className="text-[10px] text-gray-500">
//               ほか{calendarEntries.length - 2}件
//             </p>
//           </div>
//         );
//       } else if (calendarEntries.length > 0) {
//         return (
//           <div className="flex flex-col items-start">
//             {calendarEntries.map((entry) => {
//               const colorCode = Object.keys(scheduleColorMap).find(
//                 (key) => scheduleColorMap[key] === entry.scheduleColor
//               );
//               return (
//                 <p
//                   key={entry.id}
//                   style={{ color: colorCode }}
//                   className="text-[10px]"
//                 >
//                   ・{entry.content}
//                 </p>
//               );
//             })}
//           </div>
//         );
//       } else {
//         return null;
//       }
//     }
//   };
//   const onCalendarClick = (value: Date) => {
//     setSelectedDate(value);
//     setShowAllScheduleModal(true);
//   };

//   return (
//     <div className="relative">
//       <h2 className="text-white text-2xl text-center">Calendar.</h2>
//       <Calendar
//         locale="ja-JP"
//         prev2Label={null}
//         next2Label={null}
//         formatDay={(_, date) => removeSuffix({ date })}
//         formatMonthYear={(_, date) => removeMonthYearSuffix({ date })}
//         formatShortWeekday={(_, date) =>
//           ["日", "月", "火", "水", "木", "金", "土"][date.getDay()]
//         }
//         tileContent={tileContent} //日付内の各予定
//         onClickDay={onCalendarClick} //日付をクリックし詳細表示
//         className={"react-calendar"} //スタイル付与
//       />
//       <div className="flex justify-end mr-4 pb-20">
//         {/* buttonまでたどり着けるようにpudding入れてる。きれいにしたい */}
//         <button
//           onClick={() => setAddScheduleModal(true)}
//           className="block w-[55px] aspect-square rounded-full bg-text_button text-white text-xl mt-2"
//         >
//           ＋
//         </button>
//       </div>
//       <Navigation />
//       {/* プラスボタンをクリックしたときのモーダル */}
//       <Modal
//         isOpen={addScheduleModal}
//         onRequestClose={closeModal}
//         className="bg-001 p-16 max-w-lg mx-auto mt-24 rounded shadow-lg"
//         overlayClassName="absolute top-0 w-full bg-black bg-opacity-50 flex justify-center items-center"
//       >
//         <NewPost
//           closeModal={closeModal}
//           // setAddScheduleModal={setAddScheduleModal}
//         />
//         <div onClick={closeModal} className="mt-8">
//           <Button text="キャンセル" />
//         </div>
//       </Modal>
//       {/* 日付をクリックしたときのモーダル */}
//       <Modal
//         isOpen={showAllScheduleModal}
//         onRequestClose={closeModal}
//         className=" bg-001 p-16 max-w-lg mx-auto mt-24 rounded shadow-lg"
//         overlayClassName="absolute inset-0 w-full h-max min-h-screen bg-black bg-opacity-50 flex justify-center items-center"
//       >
//         <AllSchedule
//           selectedDate={selectedDate}
//           closeModal={() => setShowAllScheduleModal(false)}
//           calendars={calendars}
//           onDeleteSchedule={onDeleteSchedule}
//           onUpdateSchedule={onUpdateSchedule}
//         />
//       </Modal>
//     </div>
//   );
// };

// export default Page;
"use client";
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../app/globals.css";
import { CalendarData } from "../_type/Calendar";
import Modal from "react-modal";
import NewPost from "./_modal/NewPost";
import AllSchedule from "./_modal/AllSchedule";
import { scheduleColorMap } from "./_modal/NewPost";
import Button from "../components/Button";
import { useSupabaseSession } from "../_hooks/useSupabaseSession";
import Navigation from "../components/Navigation";

const Page: React.FC = () => {
  const { token } = useSupabaseSession();
  const [addScheduleModal, setAddScheduleModal] = useState(false);
  const [calendars, setCalendars] = useState<CalendarData[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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

  const onDeleteSchedule = (id: number) => {
    setCalendars((prevCalendars) =>
      prevCalendars.filter((calendar) => calendar.id !== id)
    );
    // 必要に応じて、APIで削除リクエストを送るコードも追加してください
  };

  const onUpdateSchedule = (id: number, newContent: string) => {
    setCalendars((prevCalendars) =>
      prevCalendars.map((calendar) =>
        calendar.id === id ? { ...calendar, content: newContent } : calendar
      )
    );
    // 必要に応じて、APIで更新リクエストを送るコードも追加してください
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
      <Modal
        isOpen={addScheduleModal}
        onRequestClose={() => setAddScheduleModal(false)}
        className="bg-001 p-16 max-w-lg mx-auto mt-24 rounded shadow-lg"
        overlayClassName="absolute top-0 w-full bg-black bg-opacity-50 flex justify-center items-center"
      >
        <NewPost closeModal={() => setAddScheduleModal(false)} />
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
          onDeleteSchedule={onDeleteSchedule}
          onUpdateSchedule={onUpdateSchedule}
        />
      </Modal>
    </div>
  );
};

export default Page;
