import { ThemeColorId } from "@prisma/client";
export interface CreateLoginPostRequestBody {
  userName: string;
  themeColorId: ThemeColorId;
}
