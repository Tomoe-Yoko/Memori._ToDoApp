import React, { useCallback, useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { AiOutlinePlus } from "react-icons/ai";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { CreatePostRequestBody } from "@/app/_type/Todo";
import Button from "@/app/_components/Button";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/utils/supabase";
import Input from "@/app/_components/Input";
import { useMouseDrag } from "@/app/_hooks/useMouseDrag";
import { useControlTodoTab } from "../_hooks/useControlTodoTab";
import { Sortable } from "@/app/_components/Sortable";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  // DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  horizontalListSortingStrategy,
  // arrayMove,
} from "@dnd-kit/sortable";

interface Props {
  todoGroups: CreatePostRequestBody[];
  activeTabId: number | null;
  setActiveTabId: (activeTabId: number) => void; //更新関数のときの型
}

const Tabs: React.FC<Props> = ({ todoGroups, activeTabId, setActiveTabId }) => {
  const { token } = useSupabaseSession();
  const [tabs, setTabs] = useState(todoGroups);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTabName, setNewTabName] = useState(""); //新しいタブの名前を入力するための状態
  const [editTab, setEditTab] = useState<CreatePostRequestBody | null>(null); //現在編集対象のタブを管理
  const [editTabName, setEditTabName] = useState(""); //編集用のタブ名を管理

  const tabContainerRef = useRef<HTMLDivElement | null>(null); //タブscroll参照
  const { handleMouseDown, handleMouseLeaveOrUp, handleMouseMove } =
    useMouseDrag(tabContainerRef);
  const {
    updateTabOrder,
    ToggleSortTabMode,
    sortTabs,
    isSortMode,
    handleDragEnd,
    setSortTabs,
  } = useControlTodoTab();
  // DnD sensors setup
  const sensors = useSensors(useSensor(PointerSensor));

  const fetcher = useCallback(async () => {
    const response = await fetch("/api/todo_group", {
      headers: {
        "Content-Type": "application/json",
        Authorization: token!,
      },
    });
    const data = await response.json();
    if (response.ok) {
      setTabs(data.todoGroups);
      setSortTabs(data.todoGroups);
    } else {
      console.error("Failed to fetch tabs:", data);
    }
  }, [token, setSortTabs]);

  useEffect(() => {
    if (!token) return;
    fetcher();
  }, [fetcher, token]);

  // モーダルを開く
  const openModal = () => {
    setIsModalOpen(true);
  };

  // モーダルを閉じる
  const closeModal = () => {
    setIsModalOpen(false);
    setNewTabName("");
  };
  //タブのデフォルト設定
  useEffect(() => {
    if (tabs.length > 0 && activeTabId === 0) {
      setActiveTabId(tabs[0].id);
    }
  }, [tabs, activeTabId, setActiveTabId]);

  //タブを切り替える処理
  const handleTabClick = (id: number) => {
    setActiveTabId(id);
  };
  //タブを編集・削除するモーダル表示
  const handleTabDoubleClick = (id: number) => {
    const tab = tabs.find((t) => t.id === id);
    if (tab) {
      setEditTab(tab);
      setEditTabName(tab.toDoGroupTitle);
    }
  };
  //PUT
  const updateTab = async () => {
    if (!editTab || !editTabName) return;
    try {
      const response = await fetch(`/api/todo_group/${editTab.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token! },
        body: JSON.stringify({ toDoGroupTitle: editTabName }),
      });
      if (response.ok) {
        setTabs(
          tabs.map((t) =>
            t.id === editTab.id ? { ...t, toDoGroupTItle: editTabName } : t
          )
        );
        setEditTab(null);
        fetcher();
        setActiveTabId(editTab.id);
      } else {
        console.error("Failed to update tab");
      }
    } catch (error) {
      console.error("Error updating tab:", error);
    }
  };

  //DELETE
  const deleteTab = async () => {
    if (!token) return;
    if (!editTab) return;
    if (!confirm("予定を削除しますか？")) return;

    try {
      const response = await fetch(`/api/todo_group/${editTab.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: token! },
      });
      if (response.ok) {
        toast.success("タブを一つ削除しました。", {
          duration: 2100, //ポップアップ表示時間
        });
        setTabs(tabs.filter((t) => t.id !== editTab.id));
        setEditTab(null);
      } else {
        console.error("Failed to delete tab");
      }
    } catch (error) {
      console.error("Error deleting tab:", error);
    }
  };

  // 新しいタブを追加
  const addTab = async () => {
    if (!token || !newTabName.trim()) return; //newTabNameが空だとreturn

    //SupabaseセッションからuserIdを取得
    const { data: userData, error } = await supabase.auth.getUser(token);
    if (error || !userData) {
      console.error("Failed to get user data");
      return;
    }

    //型合わせる
    const newTab: CreatePostRequestBody = {
      id: tabs.length + 1,
      userId: userData.user.id,
      toDoGroupTitle: newTabName,
      createdAt: new Date().toISOString(), // 現在の日時を設定
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/todo_group", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ toDoGroupTitle: newTabName }),
      });

      if (response.ok) {
        setTabs([...tabs, newTab]);
        closeModal();
      } else {
        console.error("Failed to add tab");
      }
    } catch (error) {
      console.error("Error adding tab:", error);
    }
    fetcher();
    setActiveTabId(newTab.id);
  };
  return (
    <>
      {isSortMode ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div
            className={`fixed inset-0 bg-[#787878aa] bg-opacity-40 flex items-center justify-center z-50 ${
              isSortMode ? "" : "hidden"
            }`}
          >
            <div className="bg-gray-100 p-4 rounded-lg shadow-lg w-full max-w-xs">
              <h3>タブの並び替え</h3>
              <SortableContext
                items={sortTabs.map((tab) => tab.id)}
                strategy={horizontalListSortingStrategy}
              >
                <div className="flex flex-col gap-2 p-2 border-b border-gray-700">
                  {sortTabs.map((tab) => (
                    <Sortable
                      key={tab.id}
                      id={tab.id}
                      isSortMode={true}
                      className="w-full"
                    >
                      <button
                        className={`w-full px-4 py-2 rounded-md text-left text-sm ${
                          activeTabId === tab.id
                            ? "bg-gray-800 text-white border-l-4 border-gray-600"
                            : "bg-gray-700 text-gray-300"
                        }`}
                        onClick={() => handleTabClick(tab.id)}
                      >
                        {tab.toDoGroupTitle}
                      </button>
                    </Sortable>
                  ))}
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => {
                      if (isSortMode) {
                        const sortedIds = sortTabs.map((tab) => tab.id);
                        updateTabOrder(sortedIds);
                      }
                      ToggleSortTabMode();
                    }}
                    className="p-3 text-xs text-white bg-text_button rounded-md"
                  >
                    並べ替え完了
                  </button>
                </div>
              </SortableContext>
            </div>
          </div>
        </DndContext>
      ) : (
        // <DndContext
        //   sensors={sensors}
        //   collisionDetection={closestCenter}
        //   onDragEnd={handleDragEnd}
        // >
        //   <div className="">
        //     <SortableContext
        //       items={sortTabs.map((tab) => tab.id)}
        //       strategy={horizontalListSortingStrategy}
        //     >
        //       <div className="flex">
        //         {sortTabs.map((tab) => (
        //           <Sortable
        //             key={tab.id}
        //             id={tab.id}
        //             isSortMode={true}
        //             className="min-w-fit"
        //           >
        //             <button
        //               // className={`min-w-fit px-4 py-2 rounded-custom-rounded ${
        //               //   activeTabId === tab.id
        //               //     ? "bg-gray-800 text-white border-t border-l border-r"
        //               //     : "bg-gray-900"

        //               // }`}
        //               className="min-w-fit p-2 rounded-custom-rounded bg-gray-800 text-white border-t border-l border-r text-[13px]"
        //               onClick={() => handleTabClick(tab.id)}
        //             >
        //               {tab.toDoGroupTitle}
        //             </button>
        //           </Sortable>
        //         ))}
        //       </div>
        //     </SortableContext>
        //     <button
        //       onClick={() => {
        //         if (isSortMode) {
        //           const sortedIds = sortTabs.map((tab) => tab.id);
        //           updateTabOrder(sortedIds);
        //         }
        //         ToggleSortTabMode();
        //       }}
        //       className="block p-2 min-w-fit text-white rounded-custom-rounded bg-text_button text-[11px]"
        //     >
        //       {isSortMode ? "並べ替え完了" : "並べ替え"}
        //     </button>
        //   </div>
        // </DndContext>
        <div className="p-4 pb-0 max-w-md m-auto   rounded text-text_button">
          <div
            className="flex overflow-x-auto scrollbar-hide"
            ref={tabContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeaveOrUp}
            onMouseUp={handleMouseLeaveOrUp}
            onMouseMove={handleMouseMove}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`min-w-fit px-4 py-2 rounded-custom-rounded ${
                  activeTabId === tab.id
                    ? "bg-white border-t border-l border-r"
                    : "bg-gray-200"
                }`}
                onClick={() => handleTabClick(tab.id)}
                onDoubleClick={() => handleTabDoubleClick(tab.id)}
              >
                {tab.toDoGroupTitle}
              </button>
            ))}

            {/* タブ追加 */}
            <button
              onClick={openModal}
              className="px-4 py-2 text-white rounded-custom-rounded bg-text_button "
            >
              <AiOutlinePlus size={20} />
            </button>

            {/* タブの並べ替えボタン */}
            <button
              onClick={() => {
                if (isSortMode) {
                  const sortedIds = sortTabs.map((tab) => tab.id);
                  updateTabOrder(sortedIds);
                }
                ToggleSortTabMode();
              }}
              className="block p-2 min-w-fit text-white rounded-custom-rounded bg-text_button text-[11px]"
            >
              {isSortMode ? "並べ替え完了" : "並べ替え"}
            </button>

            {/* 編集モーダル表示 */}
            <Modal
              isOpen={!!editTab}
              onRequestClose={() => setEditTab(null)}
              className="bg-white p-6 rounded shadow-md max-w-sm mx-auto mt-20 text-center"
              overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
              <h2 className="text-lg font-semibold mb-4 text-text_button">
                タブ編集
              </h2>
              <Input
                value={editTabName}
                onChange={(e) => setEditTabName(e.target.value)}
                placeholder="タブ名を編集"
              />

              <div className="mt-4 flex gap-4">
                <div onClick={updateTab}>
                  <Button text="更新" size="small" />
                </div>
                <div onClick={deleteTab}>
                  <Button text="削除" size="small" bgColor="delete" />
                </div>
              </div>
              <Toaster position="top-center" />
            </Modal>

            {/* 新規追加モーダル表示 */}
            <Modal
              isOpen={isModalOpen}
              onRequestClose={closeModal}
              className="bg-white p-6 rounded shadow-md max-w-sm mx-auto mt-20 text-center"
              overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
              <h2 className="text-lg font-semibold mb-4 text-text_button">
                ToDoタブ追加
              </h2>
              <Input
                value={newTabName}
                onChange={(e) => setNewTabName(e.target.value)}
                placeholder="タブ名を入力"
              />

              <div onClick={addTab}>
                <Button text="追加" />
              </div>
            </Modal>
          </div>
        </div>
      )}
    </>
  );
};

export default Tabs;
