import React from "react";
import { Weekly } from "@prisma/client";

interface WeeklySelectProps {
  currentDay: Weekly;
  setCurrentDay: (day: Weekly) => void;
}

const WeekdaySelect: React.FC<WeeklySelectProps> = ({
  currentDay,
  setCurrentDay,
}) => {
  const days = [
    { key: Weekly.mon, label: "Monday.（月よう日）" },
    { key: Weekly.tue, label: "Tuesday.（火よう日）" },
    { key: Weekly.wed, label: "Wednesday.（水よう日）" },
    { key: Weekly.thu, label: "Thursday.（木よう日）" },
    { key: Weekly.fri, label: "Friday.（金よう日）" },
    { key: Weekly.sat, label: "Saturday.（土よう日）" },
    { key: Weekly.sun, label: "Sunday.（日よう日）" },
  ];
  return (
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
  );
};

export default WeekdaySelect;
