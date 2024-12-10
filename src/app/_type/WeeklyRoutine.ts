import { Weekly } from "@prisma/client";

export interface Routine {
  id: number;
  weekly: Weekly;
  routineContent: string;
  isChecked: boolean;
}

export interface RoutineWorkRequestBody {
  userId: number;
  weekly: Weekly;
  routineContent: string;
  isChecked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoutineResponse extends Routine {
  createdAt: Date;
  updatedAt: Date;
}
