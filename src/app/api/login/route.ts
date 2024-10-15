import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
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
    // themeColorIdの初期値を1に設定
    //const themeColorId = body.themeColorId || themeColorId.Theme01;
    // 新しいユーザーを作成
    const userPostResponse = await prisma.users.create({
      data: {
        supabaseUserId: data.user.id,
        userName: body.userName,
        themeColorId: body.themeColorId,
      },
    });

    return NextResponse.json({
      status: 201,
      message: "success",
      user: userPostResponse,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: 400, message: error.message });
    }
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
};
