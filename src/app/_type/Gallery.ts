///// GalleryGroup
export interface GalleryGroup {
  id: number;
  userId: number;
  galleryGroupTitle: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateGalleryGroupRequestBody {
  userId: number;
  galleryGroupTitle: string;
  createdAt: string;
  updatedAt: string;
}
export interface UpdatedGalleryGroupResponse extends GalleryGroup {
  createdAt: Date;
  updatedAt: Date;
}

/////GalleryItems
export interface GalleryItem {
  id: number;
  galleryGroupId: number;
  thumbnailImageKey: string;
  createdAt: Date;
  updatedAt: Date;
  signedUrl?: string; // 画像を表示するためのサインドURL
}

// export type CreateGalleryItemRequestBody = GalleryItem;
export type CreateGalleryItemRequestBody = {
  galleryGroupId: number;
  thumbnailImageKey: string;
};
