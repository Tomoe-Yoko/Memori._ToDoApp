import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { CreatePostRequestBody } from "@/app/_type/Todo";
import { supabase } from "@/utils/supabase";

const prisma = new PrismaClient();

export const GET = async (request: Request) => {
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
    const todoGroups = await prisma.todoGroup.findMany({
      where: { userId: user.id },
    });
    return NextResponse.json({ status: "OK", todoGroups });
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
  if (!user)
    return NextResponse.json(
      { message: "ユーザーが見つかりませんでした。" },
      { status: 404 }
    );
  try {
    const body = await request.json();
    const { toDoGroupTitle }: CreatePostRequestBody = body;
    const data = await prisma.todoGroup.create({
      data: {
        userId: user.id,
        toDoGroupTitle,
      },
    });

    return NextResponse.json({
      status: "OK",
      message: "TodoGroup entry created successfully",
      id: data.id,
    });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 400 });
  }
};
