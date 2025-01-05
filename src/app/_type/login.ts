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
  themeColor: ThemeColor;
}

export interface CreateLoginPostRequestBody {
  userName: string;
  themeColorId: ThemeColorId;
}
export enum ThemeColor {
  Theme01 = "Theme01",
  Theme02 = "Theme02",
  Theme03 = "Theme03",
  Theme04 = "Theme04",
  Theme05 = "Theme05",
  Theme06 = "Theme06",
  Theme07 = "Theme07",
  Theme08 = "Theme08",
  Theme09 = "Theme09",
  Theme10 = "Theme10",
  Theme11 = "Theme11",
  Theme12 = "Theme12",
  Theme13 = "Theme13",
  Theme14 = "Theme14",
  Theme15 = "Theme15",
}
export const themeColors: Record<ThemeColor, string> = {
  [ThemeColor.Theme01]: "#E4C8CE",
  [ThemeColor.Theme02]: "#C8D3E4",
  [ThemeColor.Theme03]: "#C8E4C9",
  [ThemeColor.Theme04]: "#E2E4C8",
  [ThemeColor.Theme05]: "#D4C8E4",
  [ThemeColor.Theme06]: "#E4ACB8",
  [ThemeColor.Theme07]: "#98BDE0",
  [ThemeColor.Theme08]: "#AEE6B1",
  [ThemeColor.Theme09]: "#E6EC94",
  [ThemeColor.Theme10]: "#BAAACF",
  [ThemeColor.Theme11]: "#C6B3B2",
  [ThemeColor.Theme12]: "#A6BBA7",
  [ThemeColor.Theme13]: "#C4C796",
  [ThemeColor.Theme14]: "#C3C3C3",
  [ThemeColor.Theme15]: "#333333",
};
