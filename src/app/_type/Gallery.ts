export interface GalleryGroup {
  id: number;
  galleryGroupTitle: string;
}

export interface CreateGalleryGroupRequestBody {
  userId: number;
  id: number;
  galleryGroupTitle: string;
  createdAt: string;
  updatedAt: string;
}

// export interface UpdatedGalleryGroupRequestBody {
//   galleryGroupTitle: string;
// }

export interface UpdatedGalleryGroupResponse extends GalleryGroup {
  createdAt: Date;
  updatedAt: Date;
}

//  content: string;
//   createdAt: string;
//   galleryGroupTitle: string;
//   galleryGroupId: number;
//   thumbnailImageKey: string;
