"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  CreatePostRequestBody,
  CreateTodoItemRequestBody,
} from "../_type/Todo";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import Tabs from "./_components/Tabs";
import Navigation from "../_components/Navigation";
import Items from "./_components/Items";
import Loading from "@/app/loading";
import PlusButton from "../_components/PlusButton";

const Page: React.FC = () => {
  const { token } = useSupabaseSession();
  const [todoGroups, setTodoGroups] = useState<CreatePostRequestBody[]>([]);
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  const [todoItems, setTodoItems] = useState<CreateTodoItemRequestBody[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement | null>(null); // // 新規追加時の入力欄にフォーカスするためのRef

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

  //タスクの完了状態を切り替える
  const toggleCompletion = (id: number) => {
    setTodoItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  const addEmptyItem = () => {
    if (!activeTabId) return;

    const newItem: CreateTodoItemRequestBody = {
      // id: todoItems.length + 1,
      id: Date.now(), // 一意のIDを生成
      todoGroupId: activeTabId,
      toDoItem: "",
      isChecked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTodoItems((prevItems) => [...prevItems, newItem]);

    // 次の描画サイクルで入力欄にフォーカスを当てる
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const updateItem = (id: number, value: string) => {
    setTodoItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, toDoItem: value } : item
      )
    );
  };

  const saveItem = async (id: number) => {
    const targetItem = todoItems.find((item) => item.id === id);

    if (!targetItem || targetItem.toDoItem.trim() === "") return;

    try {
      const response = await fetch(`api/todo_group/${activeTabId}/todo_items`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify(targetItem),
      });
      if (!response.ok) {
        console.error("Failed to save item.");
      }
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

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
      <ul className="bg-white m-auto max-w-md w-[95%] pt-6 pb-16 min-h-svh">
        {todoItems
          .filter((item) => item.todoGroupId === activeTabId)
          .map((item) => (
            <Items
              key={item.id}
              id={item.id}
              toDoItem={item.toDoItem}
              isChecked={item.isChecked}
              toggleCompletion={toggleCompletion}
              inputRef={inputRef}
              updateItem={updateItem}
              saveItem={saveItem}
            />
          ))}
      </ul>

      <PlusButton handleAddEvent={addEmptyItem} />
      <Navigation />
    </div>
  );
};

export default Page;

//チェックの真偽値をデータベースに反映させる
