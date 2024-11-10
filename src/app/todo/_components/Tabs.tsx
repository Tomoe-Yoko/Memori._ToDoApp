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
  const [newTabName, setNewTabName] = useState("");
  // const [activeTabId, setActiveTabId] = useState<number | null>(null);

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

  // 新しいタブを追加
  const addTab = async () => {
    if (!token || !newTabName.trim()) return;
    //型合わせる
    const newTab: TodoGroupData = {
      id: tabs.length + 1,
      toDoGroupTitle: newTabName,
      createdAt: new Date().toISOString(), // 現在の日時を設定
      updatedAt: new Date().toISOString(),
    };
    fetcher();

    try {
      const response = await fetch("/api/todoGroup", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ toDoGroupTitle: newTabName }),
      });
      if (response.ok) {
        setTabs([...tabs, newTab]);
        closeModal();
        console.log("Tab added successfully");
      } else {
        console.error("Failed to add tab");
      }
    } catch (error) {
      console.error("Error adding tab:", error);
    }
  };

  return (
    <div className="p-4 max-w-md m-auto bg-gray-100 border rounded">
      {/* タブ表示 */}
      <div className="flex space-x-2 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} className="px-4 py-2 text-gray-700 border-b-2">
            {tab.toDoGroupTitle}
          </button>
        ))}
        <button onClick={openModal} className="px-4 py-2 text-gray-500">
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
        <h2 className="text-lg font-semibold mb-4">ToDoタブ追加</h2>
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
