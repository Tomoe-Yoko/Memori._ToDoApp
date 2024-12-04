import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { RoutineWorkRequestBody } from "@/app/_type/WeeklyRoutine";
import { supabase } from "@/utils/supabase";
import { Weekly } from "@prisma/client";
const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  const token = request.headers.get("Authorization") ?? "";
  const { error, data } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });
  const supabaseUserId = data.user.id;
  const user = await prisma.users.findUnique({ where: { supabaseUserId } });
  if (!user)
    return NextResponse.json(
      { message: "ユーザーが見つかりませんでした" },
      { status: 404 }
    );
  try {
    const body: RoutineWorkRequestBody = await request.json();
    const { weekly, routineContent, isChecked } = body;
    const data = await prisma.routineWork.create({
      data: {
        userId: user.id,
        weekly,
        routineContent,
        isChecked,
      },
    });
    return NextResponse.json({
      status: "OK",
      message: "RoutineWork created successfully",
      id: data.id,
    });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 400 });
  }
};

export const GET = async (
  request: NextRequest,
  context: { params?: { day?: string } }
) => {
  const { params } = context;
  console.log("Params:", params); // デバッグ用に出力

  if (!params || !params.day) {
    return NextResponse.json(
      { message: "曜日が指定されていません" },
      { status: 400 }
    );
  }

  const token = request.headers.get("Authorization") ?? "";
  const { error, data } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });
  const supabaseUserId = data.user.id;
  const user = await prisma.users.findUnique({ where: { supabaseUserId } });
  if (!user)
    return NextResponse.json(
      { message: "ユーザーが見つかりませんでした" },
      { status: 404 }
    );
  try {
    const dayString = params.day;

    // 型ガードを使用して文字列を列挙型に変換
    const weekday = Object.values(Weekly).includes(dayString as Weekly)
      ? (dayString as Weekly)
      : undefined;

    if (!weekday) {
      return NextResponse.json(
        { message: "無効な曜日が指定されました" },
        { status: 400 }
      );
    }

    const routineWork = await prisma.routineWork.findMany({
      where: {
        userId: user.id,
        weekly: weekday, // 曜日でフィルタリング
      },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ status: "OK", routineWork });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 400 });
  }
};
