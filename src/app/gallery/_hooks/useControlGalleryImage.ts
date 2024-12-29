"use client";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { GalleryItem } from "@/app/_type/Gallery";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/utils/supabase";

const useControlGalleryImage = (selectedTabId: number) => {
  const { token } = useSupabaseSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isImgModalOpen, setIsImgModalOpen] = useState(false);
  const [thumbnailImageKey, setThumbnailImageKey] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [thumbnailImageUrls, setThumbnailImageUrls] = useState<GalleryItem[]>(
    []
  );
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null); // クリックされた画像をModal表示（URLを保持する状態）
  const [selectedImageId, setSelectedImageId] = useState<number>();

  const generateSignedImageUrl = async (key: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("gallery_item")
        .createSignedUrl(key, 60 * 60);

      if (error) {
        throw new Error(`Error creating signed URL: ${error.message}`);
      }
      return data.signedUrl;
    } catch (error) {
      alert("画像のサイン付きURLの生成に失敗しました。");
      throw error; // 呼び出し元でキャッチするために再スロー
    }
  };

  // ギャラリー内のすべての画像のURLを取得するためのuseEffect;
  const fetchGalleryItems = useCallback(async () => {
    if (!token || !selectedTabId) return;

    setIsLoading(true);
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
      if (response.ok || data.galleryItems) {
        const itemsWithUrls: GalleryItem[] = await Promise.all(
          data.galleryItems.map(async (item: GalleryItem) => {
            const signedUrl = await generateSignedImageUrl(
              item.thumbnailImageKey
            );
            return { ...item, signedUrl }; // GalleryItemにsignedUrlを追加
          })
        );

        // 有効なURLのみをセット
        setThumbnailImageUrls(
          itemsWithUrls.filter((item) => item.signedUrl !== null)
        );
      } else {
        setThumbnailImageUrls([]);
        throw new Error(`Failed to fetch gallery items:${data}`);
      }
    } catch (error) {
      alert("画像データ取得に失敗しました。");
      setThumbnailImageUrls([]);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [token, selectedTabId]);

  useEffect(() => {
    fetchGalleryItems();
  }, [fetchGalleryItems, selectedTabId]); // useCallbackでメモ化されたfetchGalleryItemsを依存関係に追加

  //画像を追加
  const handleAddImage = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        alert("画像ファイルが選択されていません。");
        throw new Error("No image file selected.");
      }

      const file = event.target.files[0];
      const filePath = `private/${uuidv4()}`;

      // Supabase ストレージに画像をアップロード
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("gallery_item")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Upload error: ${uploadError.message}`);
      }

      setThumbnailImageKey(uploadData.path);

      // APIに画像情報を送信
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
            thumbnailImageKey: uploadData.path,
          }),
        }
      );

      if (response.ok) {
        await fetchGalleryItems(); // 画像のリストを再取得
        toast.success("画像が正常に追加されました。", {
          duration: 2100,
        });
      } else {
        const errorData = await response.json();
        throw new Error(
          `API error: ${errorData.message || "Unknown error occurred"}`
        );
      }
    } catch (error) {
      alert("画像の追加に失敗しました。もう一度お試しください。");
      throw error;
    }
  };

  //特定の画像ファイルにアクセスするためのサイン付きURLを取得
  const fetchSignedUrl = async (thumbnailImageKey: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("gallery_item") // バケット名を指定
        .createSignedUrl(thumbnailImageKey, 60 * 60); // 有効期限を1時間(3600秒)に設定

      if (error) {
        throw new Error(`Error creating signed URL:${error.message}`);
      }

      return data.signedUrl; // サインドURLを返す
    } catch (error) {
      alert("画像データ取得に失敗しました。");
      throw error;
    }
  };
  useEffect(() => {
    if (!token || !selectedTabId || !thumbnailImageKey) return;
    const fetcher = async () => {
      const signedUrl = await fetchSignedUrl(thumbnailImageKey);
      if (signedUrl) {
        setSelectedImageUrl(signedUrl); // 単一のURLを設定
      }
    };
    fetcher();
  }, [thumbnailImageKey, token, selectedTabId]);

  //画像拡大Modal
  // 画像クリック時の処理
  const handleImgClick = (url: string, key: string, id: number) => {
    setSelectedImageUrl(url);
    setThumbnailImageKey(key); // 正しいキーを設定
    setSelectedImageId(id); // 正しいIDを設定
    setIsImgModalOpen(true);
  };

  // モーダルを閉じる処理を修正して画像リセット
  const closeImgModal = () => {
    setIsImgModalOpen(false);
    setSelectedImageUrl(null); // 選択された画像をリセット;
    setThumbnailImageKey(""); // 選択された画像のキーをリセット
    setSelectedImageId(undefined); // 選択された画像のIDをリセット
  };

  const handleAddEvent = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // inputのクリックイベントをトリガー
    }
  };

  //画像変更（Modal）
  const updateImg = async (id?: number) => {
    try {
      if (!fileInputRef.current || !fileInputRef.current.files) {
        throw new Error("File input is not available or no file selected.");
      }

      const file = fileInputRef.current.files[0];
      if (!file) {
        throw new Error("No image file selected");
      }
      // 既存の画像キーを使用して更新
      const existingImageKey = thumbnailImageKey; // 既存のキーを使う

      const { error: uploadError } = await supabase.storage
        .from("gallery_item")
        .update(existingImageKey, file, {
          cacheControl: "3600",
          upsert: true,
        });
      if (uploadError) {
        throw new Error(`Image upload failed:${uploadError.message}`);
      }

      // API 経由での更新処理
      const response = await fetch(
        `/api/gallery_group/${selectedTabId}/gallery_items/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token!,
          },
          body: JSON.stringify({
            thumbnailImageKey: existingImageKey,
          }),
        }
      );

      if (response.ok) {
        await fetchGalleryItems();

        toast.success("画像が変更されました。", {
          duration: 3000, //ポップアップ表示時間
        });
        closeImgModal();
      } else {
        throw new Error("Failed to update image in database:");
      }
    } catch (error) {
      alert(
        "ファイル選択が利用できないもしくは、ファイルが選択されていません。"
      );
      throw error;
    }
  };
  //画像削除（Modal）
  const deleteImg = async (id?: number) => {
    try {
      if (!token) {
        alert("認証トークンが利用できません。");
        throw new Error("No authentication token available.");
      }
      if (!selectedImageUrl || !thumbnailImageKey || id === undefined) {
        alert("削除する画像が選択されていません。");
        throw new Error("No image selected for deletion.");
      }
      if (!confirm("画像を削除しますか？")) return;

      // バケット内の画像を削除
      const { error: storageError } = await supabase.storage
        .from("gallery_item") // バケット名を指定
        .remove([thumbnailImageKey]); // thumbnailImageKeyを利用

      if (storageError) {
        alert("バケットから画像を削除できませんでした。");
        throw new Error(
          `Failed to delete image from bucket: ${storageError.message}`
        );
      }

      const response = await fetch(
        `/api/gallery_group/${selectedTabId}/gallery_items/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token!,
          },
        }
      );

      if (response.ok) {
        fetchGalleryItems(); // 最新状態を取得
        setThumbnailImageKey(""); // キーをリセット
        closeImgModal();
        toast.success("画像を一つ削除しました。", {
          duration: 7000, //ポップアップ表示時間
        });
      } else {
        throw new Error("Failed to delete image from database.");
      }
    } catch (error) {
      alert("画像が削除できませんでした。もう一度お試しください。");
      throw error;
    }
  };

  return {
    selectedTabId,
    fileInputRef,
    handleAddImage,
    thumbnailImageUrls,
    handleImgClick,
    isImgModalOpen,
    closeImgModal,
    selectedImageUrl,
    updateImg,
    selectedImageId,
    deleteImg,
    generateSignedImageUrl,
    fetchGalleryItems,
    fetchSignedUrl,
    handleAddEvent,
    isLoading,
  };
};

export default useControlGalleryImage;
