// export interface Todo {
//   id: number;
//   userId: number;
//   toDoGroupTitle: string;
//   createdAt: Date;
//   updatedAt: Date;
//   toDoItemsId: number;
//   toDoItem: string;
//   isChecked: boolean;
// }

export interface CreatePostRequestBody {
  userId: string;
  id: number;
  toDoGroupTitle: string;
  createdAt: string;
  updatedAt: string;
}
