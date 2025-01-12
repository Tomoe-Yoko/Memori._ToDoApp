"use client";
import useSWR from "swr";
import { useSupabaseSession } from "./useSupabaseSession";
import { ThemeColorId } from "@prisma/client";
export const useUser = () => {
  const { token, isLoading } = useSupabaseSession();

  const fetcher = async () => {
    if (isLoading === undefined) return;
    //null=ログイン画面の状態
    const prams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "", //””ログイン画面の時
      },
    };
    const resp = await fetch(`/api/login`, prams);
    if (resp.status !== 200) {
      const errorData = await resp.json();
      throw new Error(
        errorData.message || "An error occurred while fetching the data."
      );
    }
    const data: {
      userData: {
        userName: string | null | undefined;
        themeColor: ThemeColorId | undefined;
      };
    } = await resp.json();
    return data;
  };
  console.log("isLoading:", isLoading);
  console.log("token:", token);
  const {
    data,
    mutate,
    error,
    isLoading: dataIsLoading,
  } = useSWR(isLoading === false ? "/api/login" : null, fetcher);
  return {
    themeColor: data?.userData.themeColor,
    userName: data?.userData.userName,
    mutate,
    error,
    isLoading: dataIsLoading,
  };
};
