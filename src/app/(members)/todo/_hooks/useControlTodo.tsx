"use client";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import {
  CreatePostRequestBody,
  CreateTodoItemRequestBody,
  UpdateTodoItemRequestBody,
  CreateResponse,
  TodoItem,
} from "@/app/_type/Todo";
import { supabase } from "@/utils/supabase";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export const useTodo = () => {
  const { token } = useSupabaseSession();
  const [todoGroups, setTodoGroups] = useState<CreatePostRequestBody[]>([]);
  const [activeTabId, setActiveTabId] = useState<number>(0);
  //////親コンポーネントでタブ一覧取得、フックで引数で渡すその配列の先頭のIDをセット
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement | null>(null); // // 新規追加時の入力欄にフォーカスするためのRef
  const [newItem, setNewItem] = useState(false);
  const [postTodoTitle, setPostTodoTitle] = useState("");

  //signUp後、初めてtodoページを開くときの表示

  const fetcher = useCallback(async () => {
    try {
      const response = await fetch("/api/todo_group", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
      });

      const { todoGroups }: { todoGroups: CreatePostRequestBody[] } =
        await response.json();
      setTodoGroups(todoGroups);
    } catch (error) {
      console.error("Failed to fetch todo groups:", error);
    }
  }, [token]);

  useEffect(() => {
    if (todoGroups.length !== 0 && activeTabId === 0) {
      setActiveTabId(todoGroups[0].id);
    }
  }, [todoGroups, activeTabId]);

  useEffect(() => {
    if (!token) return;
    fetcher();
  }, [fetcher, token]);

  //アクティブなタブの切り替え、情報を取得
  useEffect(() => {
    if (!token || activeTabId === null) return;
    const fetchTodoItems = async () => {
      try {
        const response = await fetch(
          `/api/todo_group/${activeTabId}/todo_items`,
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
  }, [token, activeTabId]); // activeTabIdが変更されたときに実行

  //新しいアイテムが追加されたときにフォーカスを当てる
  useEffect(() => {
    if (newItem) {
      inputRef.current?.focus();
    }
  }, [newItem]);
  //新しいアイテムをPOST
  const addPostNewItem = async () => {
    if (!token) return;
    //SupabaseセッションからuserIdを取得
    const { data: userData, error } = await supabase.auth.getUser(token);
    if (error || !userData) {
      console.error("Failed to get user data");
      return;
    }
    //型合わせる
    const newPostItem: CreateTodoItemRequestBody = {
      todoGroupId: activeTabId,
      toDoItem: postTodoTitle,
      isChecked: false,
    };

    try {
      const response = await fetch(`api/todo_group/${activeTabId}/todo_items`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify(newPostItem),
      });
      if (response.ok) {
        setNewItem(false);
        fetcher();
        setPostTodoTitle("");
        setActiveTabId(activeTabId);
      } else {
        console.error("Failed to save item.");
      }
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };
  //isCheckedタスクの完了状態を切り替え
  const toggleCompletion = async (id: number) => {
    if (!token) return;
    // 状態を更新し、更新されたアイテムを取得
    const isCheckedItems = todoItems.map((item) =>
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    );
    setTodoItems(isCheckedItems); // 更新されたアイテムを状態にセット
    //サーバーに送信
    const updatedItem = isCheckedItems.find((item) => item.id === id);
    try {
      const response = await fetch(
        `api/todo_group/${activeTabId}/todo_items/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: token },
          body: JSON.stringify(updatedItem),
        }
      );
      if (!response.ok) {
        console.error("Failed to save item.");
      }
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const addEmptyItem = async () => {
    // 次の描画サイクルで入力欄にフォーカスを当てる
    setNewItem(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };
  const postItem = async () => {
    if (!activeTabId || !token) return;
    const newItem: UpdateTodoItemRequestBody = {
      id: todoItems.length + 1,
      todoGroupId: activeTabId,
      toDoItem: "",
      isChecked: false,
    };
    try {
      // サーバーに新しいアイテムを送信
      const response = await fetch(
        `/api/todo_group/${activeTabId}/todo_items`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            toDoItem: newItem.toDoItem,
            isChecked: newItem.isChecked,
          }),
        }
      );

      if (response.ok) {
        const data: CreateResponse = await response.json();
        // サーバーから返された新しいIDでローカルのアイテムを更新
        setTodoItems((prevItems) =>
          prevItems.map((item) =>
            item.id === newItem.id ? { ...item, id: data.id } : item
          )
        );
      } else {
        console.error("Failed to create new todo item.");
      }
      setTodoItems((prevItems) => [...prevItems, newItem]);
      setNewItem(false);
    } catch (error) {
      console.error("Error creating new todo item:", error);
    }
  };

  const updateItem = (id: number, value: string) => {
    setTodoItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, toDoItem: value } : item
      )
    );
  };

  const saveItem = async (id: number) => {
    if (!token) return;
    const targetItem = todoItems.find((item) => item.id === id);
    if (!targetItem || targetItem.toDoItem.trim() === "") return;
    try {
      const response = await fetch(
        `api/todo_group/${activeTabId}/todo_items/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: token },
          body: JSON.stringify(targetItem),
        }
      );
      if (response.ok) {
        toast.success("タスクが追加（更新）されました。");
        fetcher();
      } else {
        console.error("Failed to save item.");
      }
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  /////DELETE
  const deleteItem = async (id: number) => {
    if (!token) return;
    if (!confirm("一つのリストを削除しますか？")) return;

    try {
      const response = await fetch(
        `/api/todo_group/${activeTabId}/todo_items/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token!,
          },
        }
      );
      if (response.ok) {
        toast.success("リストを一つを削除しました。", {
          duration: 2100, //ポップアップ表示時間
        });
        //削除したアイテム以外を表示
        setTodoItems((prevItems) => prevItems.filter((item) => item.id !== id));
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

  return {
    deleteItem,
    saveItem,
    updateItem,
    addEmptyItem,
    toggleCompletion,
    loading,
    todoGroups,
    inputRef,
    activeTabId,
    setActiveTabId,
    todoItems,
    postItem,
    newItem,
    addPostNewItem,
    setPostTodoTitle,
    postTodoTitle,
  };
};
