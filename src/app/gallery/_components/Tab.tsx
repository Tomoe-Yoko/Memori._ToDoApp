import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { CreateGalleryGroupRequestBody } from "@/app/_type/Gallery";
import Loading from "@/app/loading";
import { supabase } from "@/utils/supabase";
import { GalleryGroup } from "@prisma/client";
import React, { useCallback, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";

interface Props {
  galleryGroups: GalleryGroup[];
}

const Tab: React.FC<Props> = ({ galleryGroups }) => {
  const { token } = useSupabaseSession();
  const [tabs, setTabs] = useState(galleryGroups); //tabList
  const [selectedTabId, setSelectedTabId] = useState<number>(1); // 現在選択中のタブID
  const [newTabName, setNewTabName] = useState(""); //新しいタブの名前を入力するための状態
  const [loading, setLoading] = useState(false);

  // サーバーから特定の曜日のデータを取得
  const fetcher = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/gallery_group`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
      });
      const result = await response.json();
      // APIがオブジェクトでデータを返している
      const data = Array.isArray(result) ? result : result.ga;
      if (Array.isArray(data)) {
        setTabs(data);
      } else {
        console.error("Fetched data is not an array:", data);
        setTabs([]); // デフォルトで空の配列を設定
      }
    } catch (error) {
      console.error("Error fetching routines:", error);
      setTabs([]); // デフォルトで空の配列を設定
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
      id: tabs.length + 1,
      userId: parseInt(userData.user.id),
      galleryGroupTitle: newTabName,
    };

    try {
      const response = await fetch("/api/gallery_group", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ galleryGroups: newTabName }),
      });

      if (response.ok) {
        setTabs([...tabs, newTab]);
        // closeModal();
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
  if (loading) return <Loading />;
  return (
    <div>
      <div>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`min-w-fit px-4 py-2 rounded-custom-rounded ${
              selectedTabId === tab.id
                ? "bg-white border-t border-l border-r"
                : "bg-gray-200"
            }`}
            onClick={() => selectTab(tab.id)} // タブを切り替える処理
            // onDoubleClick={() => handleTabDoubleClick(tab.id)}
          >
            {tab.galleryGroupTitle}
          </button>
        ))}

        {/* タブのプラスボタン */}
        <button
          // onClick={openModal}
          className="px-4 py-2 text-text_button rounded-custom-rounded bg-gray-200"
        >
          <AiOutlinePlus size={20} />
        </button>
      </div>
    </div>
  );
};

export default Tab;
