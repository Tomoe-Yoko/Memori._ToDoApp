import React, { useCallback, useEffect, useState } from "react";
import Modal from "react-modal";
import { AiOutlinePlus } from "react-icons/ai";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { TodoGroupData } from "@/app/_type/Todo";
import Button from "@/app/components/Button";

interface Props {
  todoGroups: TodoGroupData[];
}

const Tabs: React.FC<Props> = () => {
  const { token } = useSupabaseSession();
  const [tabs, setTabs] = useState<TodoGroupData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTabName, setNewTabName] = useState(""); //新しいタブの名前を入力するための状態
  const [activeTabId, setActiveTabId] = useState<number | null>(null);

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
      {/* タブ表示 */}
      {/*タブが増えたらscrollさせたい overflow-x-scroll scrollbar-hide */}
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`min-w-fit px-4 py-2 rounded-custom-rounded ${
              activeTabId === tab.id
                ? "bg-white border-t border-l border-r"
                : "bg-gray-200"
            }`}
            onClick={() => handleTabClick(tab.id)}
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

      {/* モーダル表示 */}
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
