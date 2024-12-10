import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { supabase } from "@/utils/supabase";
import { Weekly } from "@prisma/client";
import { RoutineWorkRequestBody } from "@/app/_type/WeeklyRoutine";

const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
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
    const dayString = params.id; // URLパスから'id'を取得

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

///////DELETE
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const token = request.headers.get("Authorization") ?? "";
  const { error, data } = await supabase.auth.getUser(token);

  // トークンが無効または期限切れの場合の処理
  if (error) {
    return NextResponse.json(
      { message: "認証エラー: " + error.message },
      { status: 401 }
    );
  }

  const supabaseUserId = data.user.id;
  const user = await prisma.users.findUnique({ where: { supabaseUserId } });
  if (!user)
    return NextResponse.json(
      { message: "ユーザーが見つかりませんでした" },
      { status: 404 }
    );
  console.log(params);

  const { id } = params;
  const routineId = parseInt(id);
  if (isNaN(routineId)) {
    console.error("Invalid routineId ID:", id); //「無効なtroutineId ID」:`id`と表示
    return NextResponse.json({ message: "無効なIDです" }, { status: 400 });
  }
  try {
    const routine = await prisma.routineWork.findUnique({
      where: {
        userId: user.id,
        id: routineId,
      },
    });

    if (!routine) {
      console.error("RoutineWork entry not found for ID:", routineId);
      return NextResponse.json(
        { message: "削除するルーティンタスクがが見つかりません" },
        { status: 404 }
      );
    }

    await prisma.routineWork.delete({
      where: {
        userId: user.id, //userIdがuser.idであることを条件追加
        id: routineId,
      },
    });
    return NextResponse.json({ status: "OK" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error deleting TodoGroup entry:", error.message);
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};

///////PUT
export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const token = request.headers.get("Authorization") ?? "";
  const { error, data } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ message: error.message }, { status: 400 });

  const supabaseUserId = data.user.id;
  const user = await prisma.users.findUnique({ where: { supabaseUserId } });
  if (!user)
    return NextResponse.json(
      { message: "ユーザーが見つかりませんでした" },
      { status: 404 }
    );
  const { id } = params;
  const routineId = parseInt(id);

  if (isNaN(routineId))
    return NextResponse.json({ message: "無効なIDです" }, { status: 400 });
  const body: RoutineWorkRequestBody = await request.json();
  const { weekly, routineContent, isChecked } = body;
  // weeklyがnullまたはundefinedでないことを確認
  if (weekly == null) {
    return NextResponse.json(
      { message: "曜日が指定されていません。" },
      { status: 400 }
    );
  }
  try {
    const editingRoutineItem = await prisma.routineWork.update({
      where: {
        userId: user.id,
        id: routineId,
      },
      data: { weekly, routineContent, isChecked },
    });
    return NextResponse.json(
      { status: "OK", editingRoutineItem },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error }, { status: 400 });
  }
};
