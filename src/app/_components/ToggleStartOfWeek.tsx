"use client";
import React, { useCallback, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { useSupabaseSession } from "../_hooks/useSupabaseSession";
import { CreateLoginPostResponse } from "../_type/login";
import Button from "./Button";

const options = [
  { value: "gregory", label: "日曜始まり" },
  { value: "iso8601", label: "月曜始まり" },
];

const ToggleStartOfWeek: React.FC = () => {
  const { token } = useSupabaseSession();
  const { control, handleSubmit, watch, reset } = useForm<{
    startOfWeek: "iso8601" | "gregory" | null;
  }>({
    defaultValues: { startOfWeek: "iso8601" },
  });
  const startOfWeekValue = watch("startOfWeek");

  const fetcher = useCallback(async () => {
    try {
      if (!token) return;
      const res = await fetch("api/users", {
        // method: "GET",
        headers: { "Content-Type": "application/JSON", Authorization: token! },
      });
      if (!res.ok) throw new Error("Failed to fetch startOfWeek");

      const data: CreateLoginPostResponse = await res.json();

      if (
        data.userData.startOfWeek === "gregory" ||
        data.userData.startOfWeek === "iso8601"
      ) {
        reset({
          startOfWeek: data.userData.startOfWeek,
        });
      }
    } catch (error) {
      console.error("Error fetching startOfWeek:", error);
      toast.error("設定の取得に失敗しました。");
    }
  }, [token, reset]);
  useEffect(() => {
    fetcher();
  }, [fetcher]);

  const onSubmit = async () => {
    if (!startOfWeekValue) return;
    try {
      const res = await fetch("api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/JSON", Authorization: token! },
        body: JSON.stringify({ startOfWeek: startOfWeekValue }),
      });
      if (!res.ok) {
        return toast.error("エラー：変更できませんでした。");
      }

      toast.success(
        <span>
          カレンダーページ
          <br />
          曜日の始まりを設定しました。
        </span>
      );
      fetcher();
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast.error("更新できませんでした。", {
        duration: 2100,
      });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3  ">
      <div className="flex items-center gap-1 min-w-[270px]">
        <label className="w-[70px] text-sm font-medium text-text_button">
          週始まり:
        </label>
        <Controller
          name="startOfWeek"
          control={control}
          render={({ field }) => (
            <Select
              options={options}
              value={options.find((option) => option.value === field.value)}
              onChange={(newValue) => field.onChange(newValue?.value)}
              className="w-[150px]"
              classNames={{
                control: () =>
                  "!border-gray-300 !outline-none !text-text_button",
                placeholder: () => "!text-gray-500",
                dropdownIndicator: () => "!text-gray-500",
                indicatorSeparator: () => "!bg-gray-300",
                singleValue: () => "!text-text_button",
              }}
            />
          )}
        />
        <div onClick={handleSubmit(onSubmit)} className="w-[70px]">
          <Button text={"決定"} size="tiny" />
        </div>
        <Toaster />
      </div>
    </div>
  );
};

export default ToggleStartOfWeek;
