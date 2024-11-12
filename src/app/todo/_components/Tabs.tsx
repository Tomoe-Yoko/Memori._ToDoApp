import React, { useCallback, useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { AiOutlinePlus } from "react-icons/ai";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { TodoGroupData } from "@/app/_type/Todo";
import Button from "@/app/components/Button";
import toast, { Toaster } from "react-hot-toast";

interface Props {
  todoGroups: TodoGroupData[];
}

const Tabs: React.FC<Props> = () => {
  const { token } = useSupabaseSession();
  const [tabs, setTabs] = useState<TodoGroupData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTabName, setNewTabName] = useState(""); //新しいタブの名前を入力するための状態
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  const [editTab, setEditTab] = useState<TodoGroupData | null>(null); //現在編集対象のタブを管理
  const [editTabName, setEditTabName] = useState(""); //編集用のタブ名を管理
  const tabContainerRef = useRef<HTMLDivElement | null>(null); //タブscroll参照

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0); //タブドラッグ

  const fetcher = useCallback(async () => {
    const response = await fetch("/api/todoGroup", {
      headers: {
        "Content-Type": "application/json",
        Authorization: token!,
      },
    });
    const data = await response.json();
    if (response.ok) {
      setTabs(data.todoGroups);
    } else {
      console.error("Failed to fetch tabs:", data);
    }
  }, [token]);

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
    if (tabs.length > 0 && activeTabId === null) {
      setActiveTabId(tabs[0].id);
    }
  }, [tabs, activeTabId]);

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
      const response = await fetch(`/api/todoGroup/${editTab.id}`, {
        method: "PUT",
        headers: { ContentType: "application/json", Authorization: token! },
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
      const response = await fetch(`/api/todoGroup/${editTab.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: token! },
      });
      if (response.ok) {
        toast.success("予定を削除しました。", {
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
  //タブドラッグ
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (tabContainerRef.current?.offsetLeft || 0);
    scrollLeft.current = tabContainerRef.current?.scrollLeft || 0;
  };
  const handleMouseLeaveOrUp = () => {
    isDragging.current = false;
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (tabContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 2; // スクロール速度を調整
    if (tabContainerRef.current) {
      tabContainerRef.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  //タブscroll
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (tabContainerRef.current) {
        tabContainerRef.current.scrollLeft += event.deltaY;
      }
    };

    const container = tabContainerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel);
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  // 新しいタブを追加
  const addTab = async () => {
    if (!token || !newTabName.trim()) return; //newTabNameが空だとreturn
    //型合わせる
    const newTab: TodoGroupData = {
      id: tabs.length + 1,
      toDoGroupTitle: newTabName,
      createdAt: new Date().toISOString(), // 現在の日時を設定
      updatedAt: new Date().toISOString(),
    };
    try {
      const response = await fetch("/api/todoGroup", {
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
    <div className="p-4 max-w-md m-auto   rounded text-text_button">
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
        <button
          onClick={openModal}
          className="px-4 py-2 text-text_button rounded-custom-rounded bg-gray-200"
        >
          <AiOutlinePlus size={20} />
        </button>
      </div>
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
        <input
          type="text"
          value={editTabName}
          onChange={(e) => setEditTabName(e.target.value)}
          placeholder="タブ名を編集"
          className="border p-2 w-full mb-4"
        />
        {/* <div className="flex space-x-4"> ボタンの仕様を変えたい*/}
        <div className="mt-4">
          <div onClick={updateTab}>
            <Button text="更新" />
          </div>
          <div onClick={deleteTab}>
            <Button text="削除" />
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
        <input
          type="text"
          value={newTabName}
          onChange={(e) => setNewTabName(e.target.value)}
          placeholder="タブ名を入力"
          className="border p-2 w-full mb-4"
        />

        <div onClick={addTab}>
          <Button text="追加" />
        </div>
      </Modal>
    </div>
  );
};

export default Tabs;

{
  /* <BsTrash3Fill size={14} /> */
}
