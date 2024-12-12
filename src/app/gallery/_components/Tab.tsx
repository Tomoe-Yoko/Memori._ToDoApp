import Modal from "react-modal";
import Button from "@/app/_components/Button";
// import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
// import { CreateGalleryGroupRequestBody } from "@/app/_type/Gallery";
// import Loading from "@/app/loading";
// import { supabase } from "@/utils/supabase";
import { GalleryGroup } from "@/app/_type/Gallery";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import Input from "@/app/_components/Input";

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
  setNewTabName,
}) => {
  return (
    <div>
      <div className="flex overflow-x-auto scrollbar-hide">
        {galleryGroups.map((galleryGroup) => (
          <button
            key={galleryGroup.id}
            className={`min-w-fit px-4 py-2 rounded-custom-rounded ${
              selectedTabId === galleryGroup.id
                ? "bg-white border-t border-l border-r"
                : "bg-gray-200"
            }`}
            onClick={() => selectTab(galleryGroup.id)} // タブを切り替える処理
            // onDoubleClick={() => handleTabDoubleClick(tab.id)}
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
    </div>
  );
};

export default Tab;
