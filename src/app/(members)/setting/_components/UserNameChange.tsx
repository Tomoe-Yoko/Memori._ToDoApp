"use client";
import Button from "@/app/_components/Button";
import Input from "@/app/_components/Input";
import { useUser } from "@/app/_hooks/useUser";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  token: string | null;
}

const UserNameChange: React.FC<Props> = ({ token }) => {
  const { mutate, userName: getUserName } = useUser();
  const [userName, setUserName] = useState<string | null | undefined>("");
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (getUserName) setUserName(getUserName);
  }, [getUserName]);
  const handleUserNameChange = async () => {
    if (!token || !userName) return;
    setLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
        body: JSON.stringify({ userName }),
      });
      if (!response.ok) {
        throw new Error("ユーザーネームの変更に失敗しました。");
      }
      mutate();
      toast.success("ユーザーネームが変更されました", {
        duration: 2100, //ポップアップ表示時間
      });
    } catch (error) {
      console.error("ユーザーネームの変更に失敗しました。", error);
      alert("ユーザーネームの変更に失敗しました。");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      {/* <div className="flex justify-between items-center mt-6  w-[250px] mx-auto text-lg text-text_button"> */}
      <div className="flex gap-4 justify-center items-center text-lg text-text_button">
        <label className=" text-sm">名前:</label>
        <div className="w-[150px] mt-4">
          <Input
            value={userName || ""}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="新しいユーザーネームを入力"
            disabled={loading}
          />
        </div>

        <div onClick={handleUserNameChange}>
          <Button text="変更" size="tiny" />
        </div>
      </div>
    </div>
  );
};

export default UserNameChange;
