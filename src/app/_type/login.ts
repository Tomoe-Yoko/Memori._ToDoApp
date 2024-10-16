import { ThemeColorId } from "@prisma/client";
export interface CreateLoginPostRequestBody {
  supabaseUserId: string;
  userName: string;
  themeColorId: ThemeColorId;
}
