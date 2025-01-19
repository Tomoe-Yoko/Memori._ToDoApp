import React, { ChangeEvent } from "react";
import { GalleryItem } from "@/app/_type/Gallery";
import Image from "next/image";
import Modal from "react-modal";
import Button from "@/app/_components/Button";
import CloseButton from "@/app/_components/CloseButton";

interface Props {
  selectedTabId: number;
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  handleAddImage: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  thumbnailImageUrls: GalleryItem[];
  handleImgClick: (url: string, key: string, id: number) => void;
  isImgModalOpen: boolean;
  closeImgModal: () => void;
  selectedImageUrl: string | null;
  updateImg: (id?: number) => Promise<void>;
  selectedImageId: number | undefined;
  deleteImg: (id?: number) => Promise<void>;
}

const GalleryImage: React.FC<Props> = ({
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
}) => {
  // タブが選択されていない場合、早期リターン
  if (typeof selectedTabId === "undefined" || selectedTabId === null) {
    return <p className="text-red-500">タブが選択されていません。</p>;
  }
  // タブが選択されている場合
  return (
    <div>
      <ul className="bg-white m-auto max-w-md w-[95%] pt-6 pb-16 min-h-svh">
        <li>
          <div className=" flex flex-wrap justify-between items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAddImage}
              accept="image/*"
              className="hidden"
            />

            {thumbnailImageUrls.length > 0 ? (
              thumbnailImageUrls.map((item: GalleryItem) => {
                return (
                  <Image
                    key={item.id}
                    src={item.signedUrl!}
                    alt={`Selected Image ${item.id}`}
                    width={600}
                    height={848}
                    priority
                    className="max-w-[48%] min-w-[110px] object-contain bg-0[#eee] m-[2px]"
                    onClick={() =>
                      handleImgClick(
                        item.signedUrl!,
                        item.thumbnailImageKey,
                        item.id
                      )
                    }
                  />
                );
              })
            ) : (
              <p className="mx-auto text-text_button text-lg">
                画像はまだありません。
              </p>
            )}
          </div>
        </li>
      </ul>
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
              <div
                onClick={() => fileInputRef.current?.click()} // ボタンを押すとファイル選択をトリガー
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={() => updateImg(selectedImageId)} // ファイルが選択されたら関数を呼び出す
                />
                <Button text="更新" size="small" />
              </div>
              ;
              <div
                onClick={() =>
                  selectedImageId !== undefined && deleteImg(selectedImageId)
                }
              >
                <Button text="削除" size="small" bgColor="delete" />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GalleryImage;
