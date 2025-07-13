import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { CreatePostRequestBody } from "@/app/_type/Calendar";
import { supabase } from "@/app/_utils/supabase";

const prisma = new PrismaClient();

export const GET = async (request: Request) => {
  const token = request.headers.get("Authorization") ?? ""; //ログインしているユーザーか判別（tokenを検証）

  const { error, data } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 }); //ログインして表示させたいページは書く
  const supabaseUserId = data.user.id; //supabaseからuseIdを取り出す
  //supabaseUserIdをもとにuserテーブルを見つける↓
  const user = await prisma.users.findUnique({
    where: { supabaseUserId }, //{supabaseUserId:supabaseUserId}同じ名前なら略せる（省略記法keyとvalueが一緒）
  });
  if (!user)
    return NextResponse.json(
      { message: "ユーザーが見つかりませんでした" },
      { status: 404 }
    );

  try {
    //カレンダーの一覧を見つけ出す！
    const calendars = await prisma.calendar.findMany({
      //findの内容（オブジェクト）何も書かなければすべて取ってくる
      //ユーザーIDをwhereで指定
      where: { userId: user.id }, //calendar`テーブルの`userId`列が現在のユーザーのIDと一致するレコードを取得する
      orderBy: { createdAt: "asc" }, // 昇順
    });
    //フロントエンドに返すコード
    return NextResponse.json(
      {
        status: "OK",
        calendars,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 400 });
  }
};

export const POST = async (request: Request) => {
  const token = request.headers.get("Authorization") ?? "";
  const { error, data } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });
  const supabaseUserId = data.user.id;
  const user = await prisma.users.findUnique({
    where: { supabaseUserId },
  });
  //userIdが見つからなかったら404ページを作成（ログインしてるページには全部かく）
  if (!user)
    return NextResponse.json(
      { message: "ユーザーが見つかりませんでした" },
      { status: 404 }
    );
  // ユーザーidがあったら以下が処理される
  try {
    const body = await request.json();

    const { scheduleDate, content, scheduleColor }: CreatePostRequestBody =
      body;
    // scheduleDateをISO-8601形式に変換
    const date = new Date(scheduleDate);
    const isoDateTime = date.toISOString();
    const data = await prisma.calendar.create({
      data: {
        userId: user.id,
        scheduleDate: isoDateTime, // ここでISO-8601形式を使用
        content,
        scheduleColor,
      },
    });

    return NextResponse.json({
      status: "OK",
      message: "Calendar entry created successfully",
      id: data.id,
    });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 400 });
  }
};
