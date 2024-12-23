"use client";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Modal from "react-modal";
import Navigation from "../_components/Navigation";
import toast, { Toaster } from "react-hot-toast";
import Tab from "./_components/Tab";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { GalleryGroup, GalleryItem } from "@/app/_type/Gallery";
import Loading from "@/app/loading";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/utils/supabase";
import Image from "next/image";
import PlusButton from "../_components/PlusButton";
import CloseButton from "../_components/CloseButton";
import Button from "../_components/Button";

const Page = () => {
  const { token } = useSupabaseSession();
  const [loading, setLoading] = useState(false);
  const [galleryGroups, setGalleryGroups] = useState<GalleryGroup[]>([]); //tabList
  const [selectedTabId, setSelectedTabId] = useState<number>(0); // 現在選択中のタブID
  const [newTabName, setNewTabName] = useState(""); //新しいタブの名前を入力するための状態
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImgModalOpen, setIsImgModalOpen] = useState(false);
  const [editGalleryGroup, setEditGalleryGroup] = useState<GalleryGroup | null>(
    null
  ); //現在編集対象のタブを管理
  const [editGalleryGroupName, setEditGalleryGroupName] = useState(""); //編集用のタブ名を管理
  /////imgのステート
  const [thumbnailImageKey, setThumbnailImageKey] = useState<string | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [thumbnailImageUrls, setThumbnailImageUrls] = useState<string[]>([]);

  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null); // クリックされた画像をModal表示（URLを保持する状態）

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
        setGalleryGroups(galleryGroups);
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
  // Tabモーダルを開く
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Tabモーダルを閉じる
  const closeModal = () => {
    setIsModalOpen(false);
    setNewTabName("");
  };

  //////////GalleryItem
  // 画像表示;
  const generateSignedImageUrl = async (key: string) => {
    const { data, error } = await supabase.storage
      .from("gallery_item") // 正しいバケット名を指定
      .createSignedUrl(key, 60 * 60); // 有効期限を1時間に設定

    if (error) {
      console.error("Error creating signed URL:", error.message);
      return null;
    }
    return data.signedUrl;
  };

  // 画像のURLを取得するためのuseEffect;
  const fetchGalleryItems = useCallback(async () => {
    if (!token || !selectedTabId) return;

    setLoading(true);
    try {
      // API経由でGalleryItemsテーブルからデータを取得
      const response = await fetch(
        `/api/gallery_group/${selectedTabId}/gallery_items`,
        {
          headers: {
            Authorization: token!,
          },
        }
      );

      const data = await response.json();
      if (!response.ok || !data.galleryItems) {
        console.error("Failed to fetch gallery items:", data);
        setThumbnailImageUrls([]);
        return;
      }

      const urls = await Promise.all(
        data.galleryItems.map(async (item: GalleryItem) => {
          const signedUrl = await generateSignedImageUrl(
            item.thumbnailImageKey
          );
          return signedUrl;
        })
      );

      // 有効なURLのみをセット
      setThumbnailImageUrls(
        urls.filter((url: string) => url !== null) as string[]
      );
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      setThumbnailImageUrls([]);
    } finally {
      setLoading(false);
    }
  }, [token, selectedTabId]); // 依存関係に token と selectedTabId を追加

  useEffect(() => {
    fetchGalleryItems();
  }, [fetchGalleryItems]); // useCallback でメモ化された fetchGalleryItems を依存関係に追加
  //画像をstorageに追加
  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const filePath = `private/${uuidv4()}`;

    const { data, error } = await supabase.storage
      .from("gallery_item")
      .upload(filePath, file, {
        cacheControl: "3600", //キャッシュ制御の設定。3600秒（1時間）キャッシュされるように指定
        upsert: false, //同じ名前のファイルが存在する場合に上書きするかどうか（ここでは上書きしない）。
      });

    if (error) {
      alert(error.message);

      return;
    }

    setThumbnailImageKey(data.path);

    // 新しい画像情報をAPI(table)にも送信
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

  //ファイルを一時的にアクセス可能にする サインドURL
  const fetchSignedUrl = async (thumbnailImageKey: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("gallery_item") // バケット名を指定
        .createSignedUrl(thumbnailImageKey, 60 * 60); // 有効期限を1時間(3600秒)に設定

      if (error) {
        console.error("Error creating signed URL:", error.message);
        return null;
      }

      return data.signedUrl; // サインドURLを返す
    } catch (error) {
      console.error("Error fetching signed URL:", error);
      return null;
    }
  };
  useEffect(() => {
    if (!token || !selectedTabId || !thumbnailImageKey) return;
    // console.log(thumbnailImageUrls);

    const fetcher = async () => {
      const signedUrl = await fetchSignedUrl(thumbnailImageKey);
      if (signedUrl) {
        setThumbnailImageUrls((prevUrls) => [...prevUrls, signedUrl]);
      }
    };

    fetcher();
  }, [thumbnailImageKey, token, selectedTabId]);

  //画像拡大Modal

  // 画像クリック時の処理
  const handleImgClick = (url: string, key: string) => {
    setSelectedImageUrl(url);
    setThumbnailImageKey(key); // 削除対象のキーを設定
    setIsImgModalOpen(true);
  };

  // モーダルを閉じる処理を修正して画像リセット
  const closeImgModal = () => {
    setIsImgModalOpen(false);
    setSelectedImageUrl(null); // 選択された画像をリセット
  };

  const handleAddEvent = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // inputのクリックイベントをトリガー
    }
  };

  //  console.log(data);
  console.log(thumbnailImageKey);
  console.log(selectedImageUrl);
  //画像変更（Modal）
  //画像削除（Modal）
  const deleteImg = async () => {
    if (!token) return;
    if (!selectedImageUrl || !thumbnailImageKey) return;
    if (!confirm("画像を削除しますか？")) return;
    try {
      // バケット内の画像を削除
      const { error: storageError } = await supabase.storage
        .from("gallery_item") // バケット名を指定
        .remove([thumbnailImageKey]); // thumbnailImageKeyを利用

      if (storageError) {
        console.error(
          "Failed to delete image from bucket:",
          storageError.message
        );
        return;
      }

      const response = await fetch(
        `/api/gallery_group/${selectedTabId}/gallery_items/${thumbnailImageKey}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token!,
          },
        }
      );

      if (response.ok) {
        toast.success("画像を一つ削除しました。", {
          duration: 2100, //ポップアップ表示時間
        });
        await fetchGalleryItems(); // 最新状態を取得
        setSelectedImageUrl(null);
        setThumbnailImageKey(null); // キーをリセット
      } else {
        console.error("Failed to delete tab");
      }
    } catch (error) {
      console.error("Error deleting Image:", error);
    }
  };

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
            <div className="w-[95%] mx-auto">
              {selectedTabId && (
                <div className=" flex flex-wrap justify-between items-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {thumbnailImageUrls.length > 0 ? (
                    thumbnailImageUrls.map((item, index) => (
                      <Image
                        key={index}
                        src={item} // 表示する画像のURL
                        alt={`Selected Image ${index}`}
                        width={600}
                        height={848}
                        priority
                        className="max-w-[50%] min-w-[150px] min-h-[212px] object-contain bg-0[#eee]"
                        onClick={() =>
                          handleImgClick(()=item, item.thumbnailImageKey)
                        } // URLとキーを渡す
                      />
                    ))
                  ) : (
                    <p className="mx-auto text-text_button text-lg">
                      画像はまだありません。
                    </p> // 空のときの表示
                  )}
                </div>
              )}
            </div>
          </li>
        </ul>
        <PlusButton handleAddEvent={handleAddEvent} />
        <Navigation />
        <Toaster position="top-center" />{" "}
        <Modal
          isOpen={isImgModalOpen}
          onRequestClose={closeImgModal}
          ariaHideApp={false}
          className="  max-w-lg mx-auto"
          overlayClassName="absolute inset-0 w-full h-max min-h-screen bg-black bg-opacity-80 flex justify-center items-center"
        >
          {selectedImageUrl && (
            <div>
              <div className="absolute top-12 right-[10%]  ">
                <CloseButton onClick={closeImgModal} />
              </div>
              <Image
                src={selectedImageUrl}
                alt="LargeImage"
                width={600}
                height={848}
                className="w-full h-auto object-contain"
              />
              <div className="mt-4 flex gap-4 justify-center">
                <div>
                  <Button text="更新" size="small" />
                </div>
                <div onClick={deleteImg}>
                  <Button text="削除" size="small" bgColor="delete" />
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};
export default Page;
