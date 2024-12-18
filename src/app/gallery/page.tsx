"use client";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Navigation from "../_components/Navigation";
import toast, { Toaster } from "react-hot-toast";
import Tab from "./_components/Tab";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { GalleryGroup } from "@/app/_type/Gallery";
import Loading from "@/app/loading";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/utils/supabase";
import Image from "next/image";
import PlusButton from "../_components/PlusButton";

const Page = () => {
  const { token } = useSupabaseSession();
  const [loading, setLoading] = useState(false);
  const [galleryGroups, setGalleryGroups] = useState<GalleryGroup[]>([]); //tabList
  const [selectedTabId, setSelectedTabId] = useState<number>(0); // 現在選択中のタブID
  const [newTabName, setNewTabName] = useState(""); //新しいタブの名前を入力するための状態
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editGalleryGroup, setEditGalleryGroup] = useState<GalleryGroup | null>(
    null
  ); //現在編集対象のタブを管理
  const [editGalleryGroupName, setEditGalleryGroupName] = useState(""); //編集用のタブ名を管理
  /////imgのステート
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(
    null
  );
  const [thumbnailImageKey, setThumbnailImageKey] = useState<string | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [thumbnailImageUrls, setThumbnailImageUrls] = useState<string[]>([]);

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
        fetcher();
        setSelectedTabId(data.id); // 新しいタブのIDを設定
        closeModal();
      } else {
        console.error("Failed to add tab");
      }
    } catch (error) {
      console.error("Error adding tab:", error);
    }
  };
  // タブを切り替える処理
  const selectTab = (tabId: number) => {
    setSelectedTabId(tabId);
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
      } else {
        console.error("Failed to update tab");
      }
    } catch (error) {
      console.error("Error updating tab:", error);
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
        toast.success("タブを一つ削除しました。", {
          duration: 2100, //ポップアップ表示時間
        });
        setGalleryGroups(
          galleryGroups.filter((g) => g.id !== editGalleryGroup.id)
        );
        setEditGalleryGroup(null);
      } else {
        console.error("Failed to delete tab");
      }
    } catch (error) {
      console.error("Error deleting tab:", error);
    }
  };
  // モーダルを開く
  const openModal = () => {
    setIsModalOpen(true);
  };

  // モーダルを閉じる
  const closeModal = () => {
    setIsModalOpen(false);
    setNewTabName("");
  };

  //////////GalleryItem
  //画像表示
  // 画像のURLを取得するためのuseEffect
  useEffect(() => {
    if (!token || selectedTabId === null) return;
    if (!thumbnailImageKey) return;

    const fetchImage = async () => {
      try {
        const response = await fetch(
          `/api/gallery_group/${selectedTabId}/gallery_items/[itemid]}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token!,
            },
          }
        );
        const {
          data: { publicUrl },
        } = await supabase.storage
          .from("gallery_item")
          .getPublicUrl(thumbnailImageKey);
        setThumbnailImageUrl(publicUrl);

        if (response.ok) {
          setThumbnailImageUrl(publicUrl);
        } else {
          console.error("Failed to fetch image URL:", publicUrl);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      } finally {
        setLoading(false);
      }
      setThumbnailImageUrls((prevUrls) => [...prevUrls, data.publicUrl]);
    };
    fetchImage();
  }, [selectedTabId, setThumbnailImageKey]);
  console.log(thumbnailImageKey);

  //画像追加
  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const filePath = `private/${uuidv4()}`;

    const { data, error } = await supabase.storage
      .from("gallery_item")
      .upload(filePath, file, {
        cacheControl: "3600", //キャッシュ制御の設定です。3600秒（1時間）キャッシュされるように指定
        upsert: false, //同じ名前のファイルが存在する場合に上書きするかどうか（ここでは上書きしない）。
      });

    if (error) {
      alert(error.message);

      return;
    }

    setThumbnailImageKey(data.path);

    // 新しい画像情報をAPIに送信する
    try {
      const response = await fetch(
        `/api/gallery_group/${selectedTabId}/gallery_items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token!,
          },
          body: JSON.stringify({
            galleryGroupId: selectedTabId,
            thumbnailImageKey: data.path,
          }),
        }
      );
      if (response.ok) {
        toast.success("画像が正常に追加されました。");
      } else {
        console.error("Failed to add image to gallery:", await response.json());
      }
    } catch (error) {
      console.error("Error adding image to gallery:", error);
    }
  };

  const handleAddEvent = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // inputのクリックイベントをトリガー
    }
  };

  //  console.log(data);
  //       console.log(thumbnailImageKey);
  //画像変更（Modal）
  //画像削除（Modal）
  //
  //
  //

  if (loading) return <Loading />;
  return (
    <div>
      <h2 className="text-white text-2xl text-center">Gallery.</h2>
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
          handleTabDoubleClick={handleTabDoubleClick}
          updateTab={updateTab}
          editGalleryGroup={editGalleryGroup}
          setEditGalleryGroup={setEditGalleryGroup}
          editGalleryGroupName={editGalleryGroupName}
          setEditGalleryGroupName={setEditGalleryGroupName}
          deleteTab={deleteTab}
        />
        <ul className="bg-white m-auto max-w-md w-[95%] pt-6 pb-16 min-h-svh">
          <li>
            <div>
              {selectedTabId && (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {thumbnailImageUrls.map((url, index) => (
                    <Image
                      key={index}
                      src={url}
                      alt={`Selected Image ${index}`}
                      width={300}
                      height={300}
                    />
                  ))}
                </div>
              )}
            </div>
          </li>
        </ul>
        <PlusButton handleAddEvent={handleAddEvent} />
        <Navigation />
        <Toaster position="top-center" />
      </div>
    </div>
  );
};
export default Page;
//参考 chap11-blog-next/src/app/admin/posts/new/page.tsx
