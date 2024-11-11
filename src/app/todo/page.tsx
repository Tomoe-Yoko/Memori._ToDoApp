"use client";
import React, { useCallback, useEffect, useState } from "react";

import { useSupabaseSession } from "../_hooks/useSupabaseSession";
import { TodoGroupData } from "../_type/Todo";
import Tabs from "./_components/Tabs";
import Navigation from "../components/Navigation";

const Page: React.FC = () => {
  const { token } = useSupabaseSession();
  const [todoGroups, setTodoGroups] = useState<TodoGroupData[]>([]);
  const fetcher = useCallback(async () => {
    const res = await fetch("api/todoGroup", {
      headers: {
        ContentType: "application/json",
        Authorization: token!,
      },
    });
    const { todoGroups } = await res.json();
    setTodoGroups(todoGroups);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetcher();
  }, [fetcher, token]);

  return (
    <div>
      <h2 className="text-white text-2xl text-center">ToDo.</h2>

      <Tabs todoGroups={todoGroups} />
      <Navigation />
    </div>
  );
};

export default Page;
