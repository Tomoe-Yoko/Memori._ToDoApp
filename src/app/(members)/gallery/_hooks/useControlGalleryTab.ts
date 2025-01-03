"use client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { GalleryGroup } from "@/app/_type/Gallery";

const useControlGalleryTab = (
  selectedTabId: number,
  setSelectedTabId: (selectedTabId: number) => void
) => {
  const { token } = useSupabaseSession();
  const [loading, setLoading] = useState(false);
  const [galleryGroups, setGalleryGroups] = useState<GalleryGroup[]>([]); //tabList
  const [newTabName, setNewTabName] = useState(""); //新しいタブの名前を入力するための状態
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editGalleryGroup, setEditGalleryGroup] = useState<GalleryGroup | null>(
    null
  ); //現在編集対象のタブを管理
  const [editGalleryGroupName, setEditGalleryGroupName] = useState(""); //編集用のタブ名を管理

  const fetcher = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/gallery_group`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
      });

      const data = await response.json(); // APIがオブジェクトでデータを返している
      if (response.ok) {
        setGalleryGroups(data.galleryGroups);
      } else {
        setGalleryGroups(galleryGroups);
        throw new Error(`Fetched data is not an array:${data}`);
      }
    } catch (error) {
      setGalleryGroups([]); // デフォルトで空の配列を設定
      alert("タブデータの取得に失敗しました。");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // 初回レンダリングおよび曜日が変更された際にデータを取得
  //不必要な再レンダリング（無限ループなど）や処理の実行を防ぐためuseEffectを分ける
  useEffect(() => {
    if (!token) return;
    fetcher();
  }, [token, fetcher]);
  useEffect(() => {
    if (galleryGroups.length !== 0 && selectedTabId === 0) {
      // 初回ロード時にだけ最初のタブを選択
      setSelectedTabId(galleryGroups[0].id);
    }
  }, [galleryGroups, selectedTabId]);

  const addTab = async () => {
    if (!token || !newTabName.trim()) return; //newTabNameが空だとreturn
    try {
      const response = await fetch("/api/gallery_group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
        body: JSON.stringify({ galleryGroupTitle: newTabName }),
      });

      const data = await response.json();
      if (response.ok) {
        await fetcher();
        setSelectedTabId(data.id); // 新しいタブのIDを設定
        closeModal();
      } else {
        throw new Error("Failed to add tab.");
      }
    } catch (error) {
      alert("タブの追加に失敗しました。");
      throw error;
    }
  };
  // タブを切り替える処理
  const selectTab = (tabId: number) => {
    if (selectedTabId === tabId) return; // 同じタブを再選択する場合は無視
    setSelectedTabId(tabId); // 状態を更新
  };
  //タブを編集・削除するためのモーダル表示
  const handleTabDoubleClick = (id: number) => {
    const tab = galleryGroups.find((g) => g.id === id);
    if (tab) {
      setEditGalleryGroup(tab);
      setEditGalleryGroupName(tab.galleryGroupTitle);
    }
  };
  //タブの更新
  const updateTab = async () => {
    if (!editGalleryGroup || !editGalleryGroupName) return;
    try {
      const response = await fetch(
        `/api/gallery_group/${editGalleryGroup.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token!,
          },
          body: JSON.stringify({ galleryGroupTitle: editGalleryGroupName }),
        }
      );
      if (response.ok) {
        setGalleryGroups(
          galleryGroups.map((g) =>
            g.id === editGalleryGroup.id
              ? { ...g, galleryGroupTitle: editGalleryGroupName }
              : g
          )
        );

        setSelectedTabId(editGalleryGroup.id);
        setEditGalleryGroup(null);
        fetcher();
        toast.success("画像が変更されました。", {
          duration: 2100, //ポップアップ表示時間
        });
      } else {
        throw new Error("Failed to update tab");
      }
    } catch (error) {
      alert("タブ名の更新に失敗しました。");
      throw error;
    }
  };

  // タブDELETE
  const deleteTab = async () => {
    if (!token) return;
    if (!editGalleryGroup) return;
    if (!confirm("予定を削除しますか？")) return;
    try {
      const response = await fetch(
        `/api/gallery_group/${editGalleryGroup.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token!,
          },
        }
      );
      if (response.ok) {
        setGalleryGroups(
          galleryGroups.filter((g) => g.id !== editGalleryGroup.id)
        );
        setEditGalleryGroup(null);
        toast.success("タブを一つ削除しました。", {
          duration: 2100, //ポップアップ表示時間
        });
      } else {
        throw new Error("Failed to delete tab");
      }
    } catch (error) {
      alert("タブを削除できませんでした。もう一度お試しください。");
      throw error;
    }
  };
  // Tabモーダルを開く
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Tabモーダルを閉じる
  const closeModal = () => {
    setIsModalOpen(false);
    setNewTabName("");
  };

  return {
    // fetcher,
    galleryGroups,
    addTab,
    selectTab,
    handleTabDoubleClick,
    updateTab,
    deleteTab,
    openModal,
    closeModal,
    isModalOpen,
    setIsModalOpen,
    newTabName,
    setNewTabName,
    editGalleryGroup,
    setEditGalleryGroup,
    editGalleryGroupName,
    setEditGalleryGroupName,
    loading,
  };
};

export default useControlGalleryTab;
