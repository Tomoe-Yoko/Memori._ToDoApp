import React from "react";
import Image from "next/image";
import calendar_icon from "../../img/nav/calender_icon.svg";
import list_icon from "../../img/nav/list_icon.svg";
import routine_icon from "../../img/nav/routine_icon.svg";
import gallery_icon from "../../img/nav/gallery_icon.svg";
import setting_icon from "../../img/nav/setting_icon.svg";
import Link from "next/link";

const Navigation = () => {
  return (
    <div className="fixed -bottom-0 -inset-x-0 max-w-md bg-[#fffe] m-auto py-2">
      <ul className="w-11/12 mx-auto flex justify-around">
        <li>
          <Link href="./calendar">
            <Image
              src={calendar_icon}
              alt="calendar"
              width={32}
              height={32}
              className="mx-auto"
            />
            <p className="text-[10px]">カレンダー</p>
          </Link>
        </li>
        <li>
          <Link href="./todo">
            <Image
              src={list_icon}
              alt="list"
              width={32}
              height={32}
              className="mx-auto"
            />
            <p className="text-[10px]">リスト</p>
          </Link>
        </li>
        <li>
          <Link href="./routine">
            <Image
              src={routine_icon}
              alt="routine"
              width={32}
              height={32}
              className="mx-auto"
            />
            <p className="text-[10px]">ルーティン</p>
          </Link>
        </li>
        <li>
          <Link href="./gallery">
            <Image
              src={gallery_icon}
              alt="gallery"
              width={32}
              height={32}
              className="mx-auto"
            />
            <p className="text-[10px]">ギャラリー</p>
          </Link>
        </li>
        <li>
          <Link href="./setting">
            <Image
              src={setting_icon}
              alt="setting"
              width={32}
              height={32}
              className="mx-auto"
            />
            <p className="text-[10px] text-center">設定</p>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
