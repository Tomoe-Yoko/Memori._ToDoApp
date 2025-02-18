"use client";
import React, { useCallback, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { useSupabaseSession } from "../_hooks/useSupabaseSession";
import { CreateLoginPostRequestBody } from "../_type/login";
import Button from "./Button";

const options = [
  { value: "gregory", label: "日曜始まり" },
  { value: "iso8601", label: "月曜始まり" },
];

const ToggleStartOfWeek: React.FC = () => {
  const { token } = useSupabaseSession();
  const { control, handleSubmit, setValue, watch } = useForm<{
    startOfWeek: { value: string; label: string } | null;
  }>({
    defaultValues: { startOfWeek: null },
  });
  const startOfWeek = watch("startOfWeek");

  const fetcher = useCallback(async () => {
    try {
      const res = await fetch("api/users");
      if (!res.ok) throw new Error("Failed to fetch startOfWeek");

      const data: CreateLoginPostRequestBody = await res.json();
      const { startOfWeek } = data;
      if (startOfWeek) {
        setValue(
          "startOfWeek",
          options.find((opt) => opt.value === data.startOfWeek) || null
        );
      }
    } catch (error) {
      console.error("Error fetching startOfWeek:", error);
    }
  }, [setValue]);
  useEffect(() => {
    if (!token) return;
    fetcher();
  }, [token, fetcher]);

  const onSubmit = async () => {
    if (!startOfWeek) return;
    try {
      const res = await fetch("api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/JSON", Authorization: token! },
        body: JSON.stringify({ startOfWeek: startOfWeek.value }),
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
    <div className="flex flex-col items-center space-y-3 w-[350px] ml-[2rem]">
      <div className="flex items-center gap-1 w-[350px]">
        <label className="w-[70px] text-sm font-medium text-text_button">
          週始まり:
        </label>
        <Controller
          name="startOfWeek"
          control={control}
          render={({ field }) => (
            <Select
              options={options}
              value={field.value}
              onChange={(newValue) => field.onChange(newValue)}
              className="w-[160px]"
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
