"use client";
import Button from "@/app/_components/Button";
import Input from "@/app/_components/Input";
import React from "react";
interface Props {
  userName: string | null | undefined;
  setUserName: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  handleUserNameChange: () => Promise<void>;
}

const UserNameChange: React.FC<Props> = ({
  userName,
  setUserName,
  handleUserNameChange,
}) => {
  return (
    <div>
      {" "}
      <div className="mt-8 mx-auto w-56 text-lg text-text_button">
        <Input
          value={userName || ""}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="新しいユーザーネームを入力"
        />
      </div>
      <div onClick={handleUserNameChange}>
        <Button text="ユーザーネーム変更" />
      </div>
    </div>
  );
};

export default UserNameChange;
