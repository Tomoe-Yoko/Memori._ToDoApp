import { PrismaClient } from "@prisma/client";
import { supabase } from "@/utils/supabase";
import { NextResponse } from "next/server";
import { CreateTodoItemRequestBody } from "@/app/_type/Todo";

const prisma = new PrismaClient();

export const GET = async (request: Request) => {
  const token = request.headers.get("Authorization") ?? "";
  const { data, error } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ status: error.message }, { status: 403 });
  const supabaseUserId = data.user.id;
  const user = await prisma.users.findUnique({ where: { supabaseUserId } });
  if (!user)
    return NextResponse.json(
      { message: "ユーザーが見つかりませんでした" },
      { status: 400 }
    );

  // ↓エンドポイントの [id] のtodoGroupに紐づくtodoItemsのみ(全部ではなく)を取得するエンドポイントにする
  const url = new URL(request.url);
  const pathSegments = url.pathname.split("/");
  const idString = pathSegments[pathSegments.length - 2]; // 最後から二番目の要素を取得
  const id = idString ? parseInt(idString, 10) : null;

  if (!id)
    return NextResponse.json(
      { message: "目的のタブが指定されていません。" },
      { status: 401 }
    );

  try {
    const todoGroup = await prisma.todoGroup.findUnique({
      where: { id: id, userId: user.id },
    });
    if (!todoGroup)
      return NextResponse.json(
        { message: "Todoタブがみつかりません。" },
        { status: 404 }
      );

    const todoItems = await prisma.todoItems.findMany({
      where: { todoGroupId: id },
    }); // 特定のtodoGroupIdに一致するものを取得
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
  // エンドポイントからtodoGroupIdを取得
  const url = new URL(request.url);
  const pathSegments = url.pathname.split("/");
  const todoGroupIdString = pathSegments[pathSegments.length - 2]; // 最後から二番目のセグメントを取得
  const todoGroupId = todoGroupIdString
    ? parseInt(todoGroupIdString, 10)
    : null;

  if (!todoGroupId) {
    return NextResponse.json(
      { message: "todoGroupIdが指定されていません。" },
      { status: 400 }
    );
  }
  try {
    const body = await request.json();
    const { toDoItem, isChecked }: CreateTodoItemRequestBody = body;

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
      return NextResponse.json({ status: error.message }, { status: 403 });
  }
};
