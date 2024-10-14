"use client";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { CalendarType } from "@/app/_type/Calendar";
import { CreatePostRequestBody } from "@/app/_type/Calendar";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { ScheduleColor as ScheduleColorEnum } from "@prisma/client";
import { create } from "domain";

const NewPost = () => {
  const { token } = useSupabaseSession();
  const [userId, setUserId] = useState(0);
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [content, setContent] = useState("");
  const [scheduleColor, setScheduleColor] = useState("Pink"); //default

  //   useEffect(() => {
  //     if (!token) return;
  //     const fetcher = async () => {
  //       const res = await fetch("api/calendar", {
  //         headers: { "Content-type": "application/json", Authorization: token },
  //       });
  //     };
  //     fetcher();
  //   }, [token]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const res = await fetch("/api/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({
        userId,
        scheduleDate,
        content,
        scheduleColor,
        // createdAt,
        // updatedAt,
      }),
    });
    const data = await res.json();

    return (
      <>
        <Calendar locale="ja-JP" prev2Label={null} next2Label={null} />
        <form onSubmit={handlePostSubmit}>
          {/* フォームフィールドを追加して、ユーザーが入力できるようにします */}
          <button type="submit">Submit</button>
        </form>
      </>
    );
  };
};
export default NewPost;
