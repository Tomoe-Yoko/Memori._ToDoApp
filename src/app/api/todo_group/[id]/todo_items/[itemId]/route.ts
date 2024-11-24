import { PrismaClient } from "@prisma/client";
import { supabase } from "@/utils/supabase";
import { NextResponse, NextRequest } from "next/server";

//import { CreateTodoItemRequestBody } from "@/app/_type/Todo";

const prisma = new PrismaClient();

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
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

  const { id } = params;
  const todoGroupId = parseInt(id, 10);

  if (isNaN(todoGroupId))
    return NextResponse.json(
      { message: "目的のタブが指定されていません。" },
      { status: 400 }
    );
  try {
    const todoGroup = await prisma.todoGroup.findUnique({
      where: { userId: user.id, id: todoGroupId },
    });
    if (!todoGroup)
      return NextResponse.json(
        { message: "Todoタブがみつかりません。", todoGroupId },
        { status: 404 }
      );

    const todoItem = await prisma.todoItems.delete({
      where: { id: todoGroupId },
    });
    return NextResponse.json({ status: "OK", todoItem });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
