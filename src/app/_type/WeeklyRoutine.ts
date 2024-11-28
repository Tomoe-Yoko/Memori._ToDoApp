import { WeeklyDay } from "@prisma/client";
export interface RoutineWeeklyRequestBody {
  userId: string;
  id: number;
  weeklyDay: WeeklyDay;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineWorkRequestBody {
  weeklyId: number;
  routineContent: string;
  isChecked: boolean;
  createdAt: string;
  updatedAt: string;
}
