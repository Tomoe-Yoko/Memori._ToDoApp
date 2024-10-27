"use client";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// import "./Sample.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Sample() {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="Sample">
      <header>
        <h1>react-calendar sample page</h1>
      </header>
      <div className="Sample__container">
        <main className="Sample__container__content">
          <Calendar onChange={onChange} showWeekNumbers value={value} />
        </main>
      </div>
    </div>
  );
}
// import React, { useState } from "react";
// import Calendar from "react-calendar";

// const datesToAddContentTo = [tomorrow, in3Days, in5Days];

// function tileContent({ date, view }) {
//   // Add class to tiles in month view only
//   if (view === "month") {
//     // Check if a date React-Calendar wants to check is on the list of dates to add class to
//     if (datesToAddContentTo.find((dDate) => isSameDay(dDate, date))) {
//       return "My content";
//     }
//   }
// }

// function MyApp() {
//   const [value, setValue] = useState(new Date());

//   return (
//     <Calendar onChange={onChange} value={date} tileContent={tileContent} />
//   );
// }
