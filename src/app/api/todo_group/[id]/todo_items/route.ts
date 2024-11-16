import { PrismaClient } from "@prisma/client";
import { supabase } from "@/utils/supabase";
import { NextResponse } from "next/server";
import { CreateTodoItemRequestBody } from "@/app/_type/Todo";

const prisma = new PrismaClient();

export const GET = async (request: Request) => {
  const token = request.headers.get("Authorization") ?? "";
  const { data, error } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });
  const supabaseUserId = data.user.id;
  const user = await prisma.users.findUnique({ where: { supabaseUserId } });
  if (!user)
    return NextResponse.json(
      { message: "ユーザーが見つかりませんでした" },
      { status: 400 }
    );
  try {
    const userTodoGroups = await prisma.todoGroup.findMany({
      where: { userId: user.id },
    });
    if (userTodoGroups.length === 0) {
      return NextResponse.json(
        { message: "Todoグループが見つかりませんでした。" },
        { status: 404 }
      );
    }

    const todoGroupIds = userTodoGroups.map((group) => group.id);
    const todoItems = await prisma.todoItems.findMany({
      where: {
        todoGroupId: {
          in: todoGroupIds, // todoGroupIdsのいずれかに一致するものを取得
        },
      },
    });
    return NextResponse.json({ status: "OK", todoItems });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

export const POST = async (request: Request) => {
  const token = request.headers.get("Authorization") ?? "";
  const { error, data } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });
  const supabaseUserId = data.user.id;
  const user = await prisma.users.findUnique({ where: { supabaseUserId } });
  if (!user)
    return NextResponse.json(
      { message: "ユーザーが見つかりませんでした。" },
      { status: 404 }
    );
  try {
    const body = await request.json();
    const { todoGroupId, toDoItem, isChecked }: CreateTodoItemRequestBody =
      body;

    const todoGroup = prisma.todoGroup.findUnique({
      where: {
        id: todoGroupId,
        userId: user.id,
      },
    });
    if (!todoGroup)
      return NextResponse.json(
        { message: "グループが見つかりませんでした。" },
        { status: 404 }
      );
    const newTodoItem = await prisma.todoItems.create({
      data: {
        todoGroupId,
        toDoItem,
        isChecked,
      },
    });

    return NextResponse.json({
      status: "OK",
      message: "todoItem entry created successfully",
      id: newTodoItem.id,
    });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
