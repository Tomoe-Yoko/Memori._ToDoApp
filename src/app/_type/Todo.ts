export interface TodoItem {
  todoGroupId: number;
  id: number;
  toDoItem: string;
  isChecked: boolean;
  sortOrder?: number;
}

export interface CreatePostRequestBody {
  userId: string;
  id: number;
  toDoGroupTitle: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoItemRequestBody {
  todoGroupId: number | null;
  toDoItem: string;
  isChecked: boolean;
  sortOrder?: number;
}

export type UpdateTodoItemRequestBody = TodoItem;

export interface CreateResponse extends TodoItem {
  createdAt: Date;
  updatedAt: Date;
}

export interface SortedItem {
  id: number;
  sortOrder: number;
}
