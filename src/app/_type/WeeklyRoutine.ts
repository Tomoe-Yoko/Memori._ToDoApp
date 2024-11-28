import { Weekly } from "@prisma/client";

export interface RoutineWorkRequestBody {
  id: number;
  userId: number;
  weekly: Weekly;
  routineContent: string;
  isChecked: boolean;
  createdAt: string;
  updatedAt: string;
}
