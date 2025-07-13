import { PrismaClient } from "@prisma/client";
import { supabase } from "@/app/_utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import { CreateTodoItemRequestBody } from "@/app/_type/Todo";

const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const token = request.headers.get("Authorization") ?? "";
  const { data, error } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ status: error.message }, { status: 403 });
  const supabaseUserId = data.user.id;
  const user = await prisma.users.findUnique({ where: { supabaseUserId } });
  if (!user)
    return NextResponse.json(
      { message: "ユーザーが見つかりませんでした" },
      { status: 404 }
    );

  // ↓エンドポイントの [id] のtodoGroupに紐づくtodoItemsのみ(全部ではなく)を取得するエンドポイントにする
  const { id } = params;
  const todoGroupId = parseInt(id, 10);

  if (isNaN(todoGroupId))
    return NextResponse.json(
      { message: "目的のタブが指定されていません。" },
      { status: 400 }
    );

  try {
    const todoGroup = await prisma.todoGroup.findUnique({
      where: { id: todoGroupId, userId: user.id },
    });
    if (!todoGroup)
      return NextResponse.json(
        { message: "Todoタブがみつかりません。" },
        { status: 404 }
      );

    const todoItems = await prisma.todoItems.findMany({
      where: { todoGroupId },
      orderBy: { createdAt: "asc" }, // 昇順
    }); // 特定のtodoGroupIdに一致するものを取得
    return NextResponse.json({ status: "OK", todoItems });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

///////POST
export const POST = async (
  request: Request,
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
      { message: "ユーザーが見つかりませんでした。" },
      { status: 404 }
    );

  // エンドポイントからtodoGroupIdを取得
  const { id } = params;
  const todoGroupId = parseInt(id, 10);

  if (isNaN(todoGroupId)) {
    console.error("Invalid todoGroupId ID:", id);
    return NextResponse.json(
      { message: "todoGroupIdが指定されていません。" },
      { status: 400 }
    );
  }
  try {
    const body: CreateTodoItemRequestBody = await request.json();
    const { toDoItem, isChecked, sortOrder } = body;

    const todoGroup = await prisma.todoGroup.findUnique({
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
        sortOrder,
      },
    });

    return NextResponse.json({
      status: "OK",
      message: "todoItem entry created successfully",
      item: newTodoItem,
    });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 403 });
  }
};
