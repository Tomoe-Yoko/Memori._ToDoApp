import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { RoutineWorkRequestBody } from "@/app/_type/WeeklyRoutine";
import { supabase } from "@/utils/supabase";

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

export const GET = async (request: NextRequest) => {
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
    const routineWork = await prisma.routineWork.findMany({
      where: {
        userId: user.id,
        // weekly: weekday, // 曜日を指定フロントで書く？
      },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ status: "OK", routineWork });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 400 });
  }
};
