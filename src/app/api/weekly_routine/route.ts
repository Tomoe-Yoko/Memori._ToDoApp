import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { RoutineWorkRequestBody } from "@/app/_type/WeeklyRoutine";
import { supabase } from "@/utils/supabase";
// import { Weekly } from "@prisma/client";
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

/////PUT(一括チェック更新)
export const PUT = async (
  request: NextRequest
  //  { params }: { params: { id?: string } } idはオプショナルに
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

  const body = await request.json();
  const routines = body.routines;
  const day = body.day;

  if (!Array.isArray(routines) || !day) {
    return NextResponse.json({ message: "無効なデータです" }, { status: 400 });
  }

  try {
    // トランザクションを使用して特定の曜日のルーティンを一括更新
    await prisma.$transaction(
      routines.map((routine) =>
        prisma.routineWork.update({
          where: { userId: user.id, id: routine.id },
          data: { isChecked: false },
        })
      )
    );

    return NextResponse.json({ status: "OK" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
