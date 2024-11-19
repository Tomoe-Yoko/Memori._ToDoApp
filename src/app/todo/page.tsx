"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  CreatePostRequestBody,
  CreateTodoItemRequestBody,
} from "../_type/Todo";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import Tabs from "./_components/Tabs";
import Navigation from "../_components/Navigation";
import Items from "./_components/Items";
import Loading from "@/app/loading";

const Page: React.FC = () => {
  const { token } = useSupabaseSession();
  const [todoGroups, setTodoGroups] = useState<CreatePostRequestBody[]>([]);
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  const [todoItems, setTodoItems] = useState<CreateTodoItemRequestBody[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetcher = useCallback(async () => {
    try {
      const response = await fetch("api/todo_group", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
      });

      const { todoGroups } = await response.json();
      setTodoGroups(todoGroups);
      if (todoGroups.length > 0) {
        setActiveTabId(todoGroups[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch todo groups:", error);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetcher();
  }, [fetcher, token]);

  //アクティブなタブの情報を取得
  useEffect(() => {
    if (!token || activeTabId === null) return;
    const fetchTodoItems = async () => {
      try {
        const response = await fetch(
          `api/todo_group/${activeTabId}/todo_items`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token!,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setTodoItems(data.todoItems);
        } else {
          console.error("Failed to fetch todo items:", data);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTodoItems();
  }, [token, activeTabId]);

  //タスクの完了状態を切り替える関数;
  const toggleCompletion = (id: number) => {
    setTodoItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };
  // const toggleCompletion = async (id: number) => {
  //   try {
  //     const response = await fetch(
  //       `/api/todo_group/${activeTabId}/todo_items/${itemId}`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: token!,
  //         },
  //         body: JSON.stringify({ isChecked: boolean }),
  //       }
  //     );
  //     if (response.ok) {
  //       setTodoItems((prevItems) =>
  //         prevItems.map((item) =>
  //           item.id === id ? { ...item, isChecked: !item.isChecked } : item
  //         )
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error updating tab:", error);
  //   }
  // };

  if (loading) {
    return <Loading />;
  }
  return (
    <div>
      <h2 className="text-white text-2xl text-center">ToDo.</h2>
      <Tabs
        todoGroups={todoGroups}
        activeTabId={activeTabId}
        setActiveTabId={setActiveTabId}
      />
      <ul>
        {todoItems
          .filter((item) => item.todoGroupId === activeTabId)
          .map((item) => (
            <Items
              key={item.id}
              id={item.id}
              toDoItem={item.toDoItem}
              isChecked={item.isChecked}
              toggleCompletion={toggleCompletion}
            />
          ))}
      </ul>

      <Navigation />
    </div>
  );
};

export default Page;

//チェックの真偽値をデータベースに反映させる
