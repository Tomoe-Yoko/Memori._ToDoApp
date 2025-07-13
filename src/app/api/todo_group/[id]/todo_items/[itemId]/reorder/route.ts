//todoアイテムの並び替え更新
import { PrismaClient } from "@prisma/client";
import { supabase } from "@/app/_utils/supabase";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } } // todoGroupId
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
      { message: "ユーザーが見つかりません" },
      { status: 404 }
    );

  const todoGroupId = parseInt(params.id, 10);
  if (isNaN(todoGroupId)) {
    return NextResponse.json(
      { message: "todoGroupIdが無効です" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { items }: { items: { id: number; sortOrder: number }[] } = body;

  try {
    const validTodoItems = await prisma.todoItems.findMany({
      where: {
        id: { in: items.map((item) => item.id) },
        todoGroup: {
          id: todoGroupId,
          userId: user.id,
        },
      },
    });
    const validIds = new Set(validTodoItems.map((item) => item.id));

    // 有効なitemのみ更新
    const updatePromises = items
      .filter((item) => validIds.has(item.id))
      .map((item) =>
        prisma.todoItems.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      );

    await Promise.all(updatePromises);

    return NextResponse.json({ status: "OK" });
  } catch (error) {
    return NextResponse.json(
      { message: "更新に失敗しました", error },
      { status: 500 }
    );
  }
};
