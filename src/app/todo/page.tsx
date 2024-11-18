// "use client";
// import React, { useCallback, useEffect, useState } from "react";

// import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
// import Tabs from "./_components/Tabs";
// import Navigation from "../_components/Navigation";
// // import {
// //   CreatePostRequestBody,
// //   CreateTodoItemRequestBody,
// // } from "../_type/Todo";
// export interface CreatePostRequestBody {
//   userId: string;
//   id: number;
//   toDoGroupTitle: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface CreateTodoItemRequestBody {
//   todoGroupId: number;
//   id: number;
//   toDoItem: string;
//   isChecked: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// const Page: React.FC = () => {
//   const { token } = useSupabaseSession();
//   const [todoGroups, setTodoGroups] = useState<CreatePostRequestBody[]>([]);
//   const [activeTabId, setActiveTabId] = useState<number | null>(null);

//   //TodoItem
//   const [todoItems, setTodoItems] = useState<CreateTodoItemRequestBody[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   //
//   const fetcher = useCallback(async () => {
//     const response = await fetch("api/todo_group", {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token!,
//       },
//     });
//     //タブのデフォルト設定
//     const { todoGroups } = await response.json();
//     setTodoGroups(todoGroups);
//     if (todoGroups.length > 0) {
//       setActiveTabId(todoGroups[0].id);
//     }
//   }, [token]);

//   useEffect(() => {
//     if (!token) return;
//     fetcher();
//   }, [fetcher, token]);

//   ///TodoItem
//   useEffect(() => {
//     if (!token || activeTabId === null) return;
//     const fetchTodoItems = async () => {
//       try {
//         const response = await fetch(
//           `api/todo_group/${activeTabId}/todo_items`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: token!, // 必要に応じてトークンをセット
//             },
//           }
//         );
//         const data = await response.json();
//         if (response.ok) {
//           setTodoItems(data.todoItems);
//         } else {
//           console.error("Failed to fetch tabs:", data);
//         }
//       } catch (error) {
//         if (error instanceof Error) {
//           setError(error.message);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTodoItems();
//   }, [token, activeTabId]);

//   if (loading) {
//     return <div>読み込み中...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }
//   console.log(activeTabId);

//   return (
//     <div>
//       <h2 className="text-white text-2xl text-center">ToDo.</h2>

//       <Tabs
//         todoGroups={todoGroups}
//         activeTabId={activeTabId}
//         setActiveTabId={setActiveTabId}
//       />
//       <ul>
//         {todoItems
//           .filter((item) => item.todoGroupId === activeTabId)
//           .map((item) => (
//             <li key={item.id}>
//               <span>{item.toDoItem}</span>
//               <span>{item.isChecked ? "完了" : "未完了"}</span>
//             </li>
//           ))}
//       </ul>
//       <Navigation />
//     </div>
//   );
// };

// export default Page;

"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  CreatePostRequestBody,
  CreateTodoItemRequestBody,
} from "../_type/Todo";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import Tabs from "./_components/Tabs";
import Navigation from "../_components/Navigation";

// export interface CreatePostRequestBody {
//   userId: string;
//   id: number;
//   toDoGroupTitle: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface CreateTodoItemRequestBody {
//   todoGroupId: number;
//   id: number;
//   toDoItem: string;
//   isChecked: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

const Page: React.FC = () => {
  const { token } = useSupabaseSession();
  const [todoGroups, setTodoGroups] = useState<CreatePostRequestBody[]>([]);
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  const [todoItems, setTodoItems] = useState<CreateTodoItemRequestBody[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetcher = useCallback(async () => {
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
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetcher();
  }, [fetcher, token]);

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
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTodoItems();
  }, [token, activeTabId]);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  // タスクの完了状態を切り替える関数
  const toggleCompletion = (id: number) => {
    setTodoItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

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
            <li key={item.id} className="flex">
              <button
                onClick={() => toggleCompletion(item.id)}
                className={`w-6 h-6 rounded-full border-2 flex justify-center items-center ${
                  item.isChecked
                    ? "bg-text_button border-text_button"
                    : "border-text_button"
                }`}
              >
                {item.isChecked && (
                  <span className="text-white font-bold">✔</span>
                )}
              </button>
              <p
                className={`text-lg ${
                  item.isChecked
                    ? "line-through text-text_button"
                    : "text-text_button"
                }`}
              >
                <span>{item.toDoItem}</span>
              </p>
            </li>
          ))}
      </ul>
      <Navigation />
    </div>
  );
};

export default Page;

//チェックの真偽値をデータベースに反映させる
//Itemをコンポーネント化する
