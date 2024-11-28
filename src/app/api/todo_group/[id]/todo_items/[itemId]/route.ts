import { PrismaClient } from "@prisma/client";
import { supabase } from "@/utils/supabase";
import { NextResponse, NextRequest } from "next/server";

import { CreateTodoItemRequestBody } from "@/app/_type/Todo";

const prisma = new PrismaClient();

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) => {
  const token = request.headers.get("Authorization") ?? "";
  const { data, error } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ message: error.message }, { status: 400 });

  const supabaseUserId = data.user.id;
  const user = await prisma.users.findUnique({
    where: { supabaseUserId },
  });
  if (!user)
    return NextResponse.json(
      { message: "ユーザーが見つかりませんでした" },
      { status: 404 }
    );

  const todoGroupId = parseInt(params.id, 10);
  const todoItemId = parseInt(params.itemId, 10);

  if (isNaN(todoGroupId) || isNaN(todoItemId))
    return NextResponse.json(
      { message: "目的のtodoリストまたはグループが指定されていません。" },
      { status: 400 }
    );

  try {
    await prisma.todoItems.delete({
      where: {
        id: todoItemId,
        todoGroup: {
          user: { supabaseUserId },
        },
      },
    });

    return NextResponse.json({ status: "OK", todoItemId });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};

/////PUT
export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) => {
  const token = request.headers.get("Authorization") ?? "";
  const { data, error } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ message: error.message }, { status: 400 });
  const supabaseUserId = data.user.id;
  const user = await prisma.users.findUnique({
    where: { supabaseUserId },
  });

  if (!user)
    return NextResponse.json(
      { message: "ユーザーが見つかりませんでした" },
      { status: 404 }
    );

  const putTodoGroupId = parseInt(params.id, 10);
  const putTodoItemId = parseInt(params.itemId, 10);
  if (isNaN(putTodoGroupId) || isNaN(putTodoItemId))
    return NextResponse.json(
      { message: "目的のtodoリストまたはグループが指定されていません。" },
      { status: 400 }
    );
  const body: CreateTodoItemRequestBody = await request.json();
  const { todoGroupId, toDoItem, isChecked } = body;

  try {
    const editingTodoItem = await prisma.todoItems.update({
      where: { id: putTodoItemId, todoGroup: { user: { supabaseUserId } } },
      data: { todoGroupId, toDoItem, isChecked },
    });
    return NextResponse.json(
      { status: "OK", editingTodoItem },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error }, { status: 400 });
  }
};
