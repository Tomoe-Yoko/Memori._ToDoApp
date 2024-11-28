import { WeeklyDay } from "@prisma/client";

export interface RoutineWorkRequestBody {
  id: number;
  userId: string;
  weeklyDay: WeeklyDay;
  routineContent: string;
  isChecked: boolean;
  createdAt: string;
  updatedAt: string;
}
