import Modal from "react-modal";
import Button from "@/app/_components/Button";
import { GalleryGroup } from "@/app/_type/Gallery";
import React, { useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import Input from "@/app/_components/Input";
import { Toaster } from "react-hot-toast";
import { useMouseDrag } from "@/app/_hooks/useMouseDrag";

interface Props {
  galleryGroups: GalleryGroup[];
  addTab: () => Promise<void>;
  openModal: () => void;
  closeModal: () => void;
  selectedTabId: number;
  isModalOpen: boolean;
  selectTab: (tabId: number) => void;
  newTabName: string;
  setNewTabName: React.Dispatch<React.SetStateAction<string>>;
  handleTabDoubleClick: (id: number) => void;
  updateTab: () => Promise<void>;
  editGalleryGroup: GalleryGroup | null;
  setEditGalleryGroup: React.Dispatch<
    React.SetStateAction<GalleryGroup | null>
  >;
  editGalleryGroupName: string;
  setEditGalleryGroupName: React.Dispatch<React.SetStateAction<string>>;
  deleteTab: () => Promise<void>;
}

const Tab: React.FC<Props> = ({
  galleryGroups,
  addTab,
  openModal,
  closeModal,
  selectTab,
  selectedTabId,
  isModalOpen,
  newTabName,
  handleTabDoubleClick,
  setNewTabName,
  editGalleryGroup,
  setEditGalleryGroup,
  editGalleryGroupName,
  setEditGalleryGroupName,
  updateTab,
  deleteTab,
}) => {
  const tabContainerRef = useRef<HTMLDivElement | null>(null); //タブscroll参照
  const { handleMouseDown, handleMouseLeaveOrUp, handleMouseMove } =
    useMouseDrag(tabContainerRef);
  return (
    <div className="p-4 pb-0 max-w-md m-auto   rounded text-text_button">
      <div
        className="flex overflow-x-auto scrollbar-hide"
        ref={tabContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
      >
        {galleryGroups.map((galleryGroup) => (
          <button
            key={galleryGroup.id}
            className={`min-w-fit px-4 py-2 rounded-custom-rounded ${
              selectedTabId === galleryGroup.id
                ? "bg-white border-t border-l border-r"
                : "bg-gray-200"
            }`}
            onClick={() => selectTab(galleryGroup.id)} // タブを切り替える処理
            onDoubleClick={() => handleTabDoubleClick(galleryGroup.id)}
          >
            {galleryGroup.galleryGroupTitle}
          </button>
        ))}

        {/* タブのプラスボタン */}
        <button
          onClick={openModal}
          className="px-4 py-2 text-text_button rounded-custom-rounded border-t border-l border-r bg-gray-200"
        >
          <AiOutlinePlus size={20} />
        </button>
      </div>
      {/* 新規追加モーダル表示 */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="bg-white p-6 rounded shadow-md max-w-sm mx-auto mt-20 text-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-lg font-semibold mb-4 text-text_button">
          ToDoタブ追加
        </h2>
        <Input
          value={newTabName}
          onChange={(e) => setNewTabName(e.target.value)}
          placeholder="タブ名を入力"
        />

        <div onClick={() => addTab()}>
          <Button text="追加" />
        </div>
      </Modal>
      {/* 編集モーダル表示 */}
      <Modal
        isOpen={!!editGalleryGroup} // 編集対象がある場合にモーダルを表示
        onRequestClose={() => setEditGalleryGroup(null)}
        className="bg-white p-6 rounded shadow-md max-w-sm mx-auto mt-20 text-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-lg font-semibold mb-4 text-text_button">
          タブ編集
        </h2>
        <Input
          value={editGalleryGroupName}
          onChange={(e) => setEditGalleryGroupName(e.target.value)}
          placeholder="タブ名を編集"
        />

        <div className="mt-4 flex gap-4">
          <div onClick={updateTab}>
            <Button text="更新" size="small" />
          </div>
          <div onClick={deleteTab}>
            <Button text="削除" size="small" bgColor="delete" />
          </div>
        </div>
        <Toaster position="top-center" />
      </Modal>
    </div>
  );
};

export default Tab;
