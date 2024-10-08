export interface Calendar {
  id: number;
  scheduleDate: Date;
  content: string;
  scheduleColor:
    | "Pink"
    | "Blue"
    | "Green"
    | "Orange"
    | "Cyan"
    | "Yellow"
    | "Wine"
    | "Purple";
  createdAt: string;
  updatedAt: string;
}
