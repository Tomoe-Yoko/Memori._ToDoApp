import { ThemeColorId } from "@prisma/client";

// export interface LoginUserData {
//   id: number;
//   supabaseUserId: string;
//   userName?: string;
//   themeColorId: ThemeColorId;
//   createdAt: Date;
//   updatedAt: Date;
// }
export interface LoginUserData {
  userName: string;
  themeColorId: ThemeColorId;
}

export interface CreateLoginPostRequestBody {
  userName: string;
  themeColorId: ThemeColorId;
}

export const themeColors: Record<string, string> = {
  Theme01: "#E4C8CE",
  Theme02: "#C8D3E4",
  Theme03: "#C8E4C9",
  Theme04: "#E2E4C8",
  Theme05: "#D4C8E4",
  Theme06: "#E4ACB8",
  Theme07: "#98BDE0",
  Theme08: "#AEE6B1",
  Theme09: "#E6EC94",
  Theme10: "#BAAACF",
  Theme11: "#C6B3B2",
  Theme12: "#A6BBA7",
  Theme13: "#C4C796",
  Theme14: "#C3C3C3",
  Theme15: "#333333",
};
