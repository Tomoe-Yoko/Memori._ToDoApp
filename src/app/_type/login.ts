import { ThemeColorId } from "@prisma/client";

export interface LoginUserData {
  userName: string;
  themeColor: ThemeColor;
}

export interface CreateLoginPostRequestBody {
  userName: string;
  themeColorId: ThemeColorId;
  startOfWeek: "iso8601" | "gregory";
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
  [ThemeColor.Theme01]: "bg-Theme01",
  [ThemeColor.Theme02]: "bg-Theme02",
  [ThemeColor.Theme03]: "bg-Theme03",
  [ThemeColor.Theme04]: "bg-Theme04",
  [ThemeColor.Theme05]: "bg-Theme05",
  [ThemeColor.Theme06]: "bg-Theme06",
  [ThemeColor.Theme07]: "bg-Theme07",
  [ThemeColor.Theme08]: "bg-Theme08",
  [ThemeColor.Theme09]: "bg-Theme09",
  [ThemeColor.Theme10]: "bg-Theme10",
  [ThemeColor.Theme11]: "bg-Theme11",
  [ThemeColor.Theme12]: "bg-Theme12",
  [ThemeColor.Theme13]: "bg-Theme13",
  [ThemeColor.Theme14]: "bg-Theme14",
  [ThemeColor.Theme15]: "bg-Theme15",
};
