import { ScheduleColor } from "@prisma/client";

export interface CalendarType {
  userId: number;
  scheduleDate: Date;
  content: string;
  scheduleColor: ScheduleColor;
  createdAt: string;
  updatedAt: string;
}
//HTTP POSTリクエストのボディに含まれるデータの型
//カレンダーのエントリを作成する際のデータ構造を定義
export interface CreatePostRequestBody {
  userId: number;
  scheduleDate: Date;
  content: string;
  scheduleColor: ScheduleColor;
  createdAt: string;
  updatedAt: string;
}
