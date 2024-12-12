"use client";
import React, { useCallback, useEffect, useState } from "react";
// import PlusButton from "../_components/PlusButton";
import Navigation from "../_components/Navigation";
import { Toaster } from "react-hot-toast";
import Tab from "./_components/Tab";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import {
  GalleryGroup,
  CreateGalleryGroupRequestBody,
} from "@/app/_type/Gallery";
import Loading from "@/app/loading";
import { supabase } from "@/utils/supabase";

const Page = () => {
  const { token } = useSupabaseSession();
  const [loading, setLoading] = useState(false);
  const [galleryGroups, setGalleryGroups] = useState<GalleryGroup[]>([]); //tabList
  const [selectedTabId, setSelectedTabId] = useState<number>(1); // 現在選択中のタブID
  const [newTabName, setNewTabName] = useState(""); //新しいタブの名前を入力するための状態
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        console.error("Fetched data is not an array:", data);
        setGalleryGroups([]); // デフォルトで空の配列を設定
      }
    } catch (error) {
      console.error("Error fetching routines:", error);
      setGalleryGroups([]); // デフォルトで空の配列を設定
    } finally {
      setLoading(false);
    }
  }, [token]);

  // 初回レンダリングおよび曜日が変更された際にデータを取得
  useEffect(() => {
    if (!token) return;
    fetcher();
  }, [token, fetcher]);

  const addTab = async () => {
    if (!token || !newTabName.trim()) return; //newTabNameが空だとreturn
    //SupabaseセッションからuserIdを取得
    const { data: userData, error } = await supabase.auth.getUser(token);
    if (error || !userData) {
      console.error("Failed to get user data");
      return;
    }
    //型合わせる
    const newTab: CreateGalleryGroupRequestBody = {
      id: galleryGroups.length + 1,
      userId: parseInt(userData.user.id),
      galleryGroupTitle: newTabName,
    };

    try {
      const response = await fetch("/api/gallery_group", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ galleryGroups: newTab }),
      });

      if (response.ok) {
        fetcher();
        closeModal();
      } else {
        console.error("Failed to add tab");
      }
    } catch (error) {
      console.error("Error adding tab:", error);
    }
    fetcher();
    setSelectedTabId(newTab.id);
  };
  // タブを切り替える処理
  const selectTab = (tabId: number) => {
    setSelectedTabId(tabId);
  };

  //タブの更新

  // モーダルを開く
  const openModal = () => {
    setIsModalOpen(true);
  };

  // モーダルを閉じる
  const closeModal = () => {
    setIsModalOpen(false);
    setNewTabName("");
  };

  if (loading) return <Loading />;
  return (
    // img
    <div>
      <Tab
        galleryGroups={galleryGroups}
        addTab={addTab}
        openModal={openModal}
        closeModal={closeModal}
        isModalOpen={isModalOpen}
        selectTab={selectTab}
        selectedTabId={selectedTabId}
        newTabName={newTabName}
        setNewTabName={setNewTabName}
      />

      {/* <PlusButton handleAddEvent={addImg} /> */}
      <Navigation />
      <Toaster position="top-center" />
    </div>
  );
};

export default Page;
