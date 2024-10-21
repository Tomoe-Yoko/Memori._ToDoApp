import { ScheduleColor } from "@prisma/client";

export interface CalendarPostType {
  userId: number;
  scheduleDate: string;
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

export interface CalendarProps {
  // locale: string;
  date: Date;
  //第一引数：locale（地域）、第二引数；date（日付）
}

export interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  className: string;
  overlayClassName: string;
}

export interface ButtonProps {
  text: string;
  onClick: () => void;
}
