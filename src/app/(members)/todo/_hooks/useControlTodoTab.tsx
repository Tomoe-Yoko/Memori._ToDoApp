"use client";
import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";
import toast from "react-hot-toast";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { SortedTab } from "@/app/_type/Todo";

export const useControlTodoTab = () => {
  const { token } = useSupabaseSession();
  const [isSortMode, setIsSortMode] = useState(false);
  const [sortTabs, setSortTabs] = useState<SortedTab[]>([]);

  const handleTabDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sortTabs.findIndex((tab) => tab.id === active.id);
    const newIndex = sortTabs.findIndex((tab) => tab.id === over.id);
    const newTabs = arrayMove(sortTabs, oldIndex, newIndex);
    setSortTabs(newTabs); // 並び順を更新（ただし保存はモードOFF時）
  };

  const clickSortTabMode = async () => {
    const isNowSortMode = isSortMode;
    setIsSortMode(!isNowSortMode);
    if (!isNowSortMode)
      return toast(
        <div>
          <p className="pb-2">🏷️タブ並べ替えモード</p>

          <p>ドラッグで並び替えられます</p>
        </div>
      );
    if (!token) return toast.error("ログインしてください。");
    const reorderedTabs = sortTabs.map((tab, index) => ({
      id: tab.id,
      sortTabOrder: index + 1,
    }));
    toast("🏷️ 並び替えモードを終了");
    try {
      const response = await fetch(`/api/todo_group/reorder`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ items: reorderedTabs }),
      });
      if (response.ok) {
        setSortTabs((prev: SortedTab[]) =>
          prev.map((tab) => {
            const updated = reorderedTabs.find((r) => r.id === tab.id);
            return updated
              ? { ...tab, sortTabOrder: updated.sortTabOrder }
              : tab;
          })
        );
        toast.success("✅ 並び順を保存しました");
      } else {
        console.error("Failed to save tab order.");
        // toast.error("❌ タブ並び順保存に失敗しました");
        toast.error(`❌ タブ並び順保存に失敗しました（${response.status}）`);
      }
    } catch (e) {
      console.error("Error updating tab order:", e);
      toast.error("❌ サーバーエラーで順番を保存できませんでした");
    }
  };

  return {
    isSortMode,
    clickSortTabMode,
    setIsSortMode,
    sortTabs,
    setSortTabs,
    handleTabDragEnd,
  };
};
