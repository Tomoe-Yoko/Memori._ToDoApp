"use client";
import React, { useState } from "react";
import Navigation from "../_components/Navigation";
import { Toaster } from "react-hot-toast";
import Tab from "./_components/Tab";
import PlusButton from "../_components/PlusButton";
import GalleryImage from "./_components/GalleryImage";
import useControlGalleryTab from "./_hooks/useControlGalleryTab";
import useControlGalleryImage from "./_hooks/useControlGalleryImage";
import Loading from "../loading";

const Page: React.FC = () => {
  const [selectedTabId, setSelectedTabId] = useState<number>(0); // 現在選択中のタブID。useControlGalleryTabとuseControlGalleryImage使うためここに記入

  const {
    galleryGroups,
    addTab,
    selectTab,
    handleTabDoubleClick,
    updateTab,
    deleteTab,
    openModal,
    closeModal,
    isModalOpen,
    newTabName,
    setNewTabName,
    editGalleryGroup,
    setEditGalleryGroup,
    editGalleryGroupName,
    setEditGalleryGroupName,
    loading,
  } = useControlGalleryTab(selectedTabId, setSelectedTabId);

  // //////////GalleryItem
  const {
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
    handleAddEvent,
    isLoading,
  } = useControlGalleryImage(selectedTabId);

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
        <div>
          {isLoading ? (
            <div className="bg-white max-w-md mx-auto">
              <Loading />
            </div>
          ) : (
            <GalleryImage
              selectedTabId={selectedTabId} // useGalleryTab から渡す
              fileInputRef={fileInputRef}
              handleAddImage={handleAddImage}
              thumbnailImageUrls={thumbnailImageUrls}
              handleImgClick={handleImgClick}
              isImgModalOpen={isImgModalOpen}
              closeImgModal={closeImgModal}
              selectedImageUrl={selectedImageUrl}
              updateImg={updateImg}
              selectedImageId={selectedImageId}
              deleteImg={deleteImg}
            />
          )}
        </div>

        <PlusButton handleAddEvent={handleAddEvent} />
        <Navigation />
        <Toaster position="top-center" />
      </div>
    </div>
  );
};
export default Page;
