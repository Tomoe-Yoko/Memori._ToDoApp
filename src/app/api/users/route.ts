import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, ThemeColorId } from "@prisma/client";
import { CreateLoginPostRequestBody } from "@/app/_type/login";
import { supabase } from "@/utils/supabase";

const prisma = new PrismaClient();

// POSTメソッドの実装
export const POST = async (request: NextRequest) => {
  const body: CreateLoginPostRequestBody = await request.json(); // 型適用
  const token = request.headers.get("Authorization") ?? "";

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return NextResponse.json(
      { status: 401, message: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    //登録があるかどうか確認する
    const getUser = await prisma.users.findUnique({
      where: {
        supabaseUserId: data.user.id,
      },
    });
    if (getUser) {
      //既に登録あれば何もしない
      return NextResponse.json({
        status: 200,
        message: "success",
        userExists: true,
      });
    }

    // 新しいユーザーを作成
    const userPostResponse = await prisma.users.create({
      data: {
        supabaseUserId: data.user.id,
        userName: body.userName,
        themeColorId: body.themeColorId,
        startOfWeek: "iso8601",
      },
    });
    const defaultTodoGroupTitle = "タブ名変更：ダブルクリック";
    // Todoグループを作成
    const firstTodoTab = await prisma.todoGroup.create({
      data: {
        userId: userPostResponse.id, // ここで正しいユーザーIDを使用
        toDoGroupTitle: defaultTodoGroupTitle, // デフォルトのタブタイトルを使用
      },
    });
    const firstGalleryTab = await prisma.galleryGroup.create({
      data: {
        userId: userPostResponse.id,
        galleryGroupTitle: defaultTodoGroupTitle,
      },
    });
    return NextResponse.json({
      status: 201,
      message: "success",
      user: userPostResponse,
      firstTodoTab,
      firstGalleryTab,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: 400, message: error.message });
    }
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
};

////GET
export const GET = async (request: NextRequest) => {
  const token = request.headers.get("Authorization") || "";

  const { error, data } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({
      status: "OK",
      userData: { userName: null, themeColor: `bg-Theme01` },
    });

  const supabaseUserId = data.user.id;
  const user = await prisma.users.findUnique({ where: { supabaseUserId } });

  if (!user)
    return NextResponse.json(
      { message: "ユーザーが見つかりませんでした" },
      { status: 404 }
    );
  try {
    const userData = {
      userName: user.userName,
      themeColor: `bg-${user.themeColorId}`,
      startOfWeek: user.startOfWeek,
    };

    return NextResponse.json({ status: "OK", userData });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
};

////PUT
export const PUT = async (request: NextRequest) => {
  const body: CreateLoginPostRequestBody = await request.json();
  const token = request.headers.get("Authorization") ?? "";

  // Supabase認証
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return NextResponse.json(
      { status: 401, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // ユーザーがデータベースに存在するか確認
    const user = await prisma.users.findUnique({
      where: {
        supabaseUserId: data.user.id,
      },
    });
    if (!user) {
      console.error("User not found for ID:", data.user.id);
      // ユーザーが存在しない場合
      return NextResponse.json(
        { status: 404, message: "User not found" },
        { status: 404 }
      );
    }

    //  POST更新データを作成（nullまたはundefinedのフィールドは無視）
    // 分割代入とスプレッド構文の合わせ技
    //`userName`が`undefined`でない場合にのみ`{ userName }`を`updateData`に追加する.カラーも同様
    const updateData: {
      userName?: string;
      themeColorId?: ThemeColorId;
      startOfWeek?: "iso8601" | "gregory";
    } = {
      ...(body.userName !== undefined && { userName: body.userName }),
      ...(body.themeColorId !== undefined && {
        themeColorId: body.themeColorId,
      }),
      ...(body.startOfWeek !== undefined && {
        startOfWeek: body.startOfWeek,
      }),
    };
    // データベースの更新
    await prisma.users.update({
      where: {
        supabaseUserId: data.user.id,
      },
      data: updateData,
    });

    return NextResponse.json({
      status: 200,
      message: "User updated successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: 400, message: error.message });
    }
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
};
