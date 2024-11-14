import { supabase } from "@/utils/supabase";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

///////PUT
interface UpdatedTodoGroupRequestBody {
  toDoGroupTitle: string;
}

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
  const todoGroupId = parseInt(id);
  if (isNaN(todoGroupId))
    return NextResponse.json({ message: "無効なIDです" }, { status: 400 });
  const body: UpdatedTodoGroupRequestBody = await request.json();
  const { toDoGroupTitle } = body;

  try {
    // const TodoTitleId = await prisma.todoGroup.findUnique({
    //   where: { id: todoGroupId },
    // });

    // if (!TodoTitleId)
    //   return NextResponse.json(
    //     { message: "更新するレコードがありません" },
    //     { status: 404 }
    //   );
    //findUnique設定しなくてよし。下記update時に、該当のtogoGroupがなければエラーで止まってくれる。
    const editingTodoTitle = await prisma.todoGroup.update({
      where: {
        userId: user.id, //userIdがuser.idであることを条件追加
        id: todoGroupId,
      },
      data: {
        toDoGroupTitle,
      },
    });

    return NextResponse.json(
      { status: "OK", editingTodoTitle },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error }, { status: 400 });
  }
};

///////DELETE
export const DELETE = async (
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
  const todoGroupId = parseInt(id);
  if (isNaN(todoGroupId)) {
    console.error("Invalid todoGroup ID:", id); //「無効なtodoGroup ID」:`id`と表示
    return NextResponse.json({ message: "無効なIDです" }, { status: 400 });
  }
  try {
    const todoGroups = await prisma.todoGroup.findUnique({
      where: {
        userId: user.id, //userIdがuser.idであることを条件追加
        id: todoGroupId,
      },
    });

    if (!todoGroups) {
      console.error("TodoGroup entry not found for ID:", todoGroupId);
      return NextResponse.json(
        { message: "削除するレコードが見つかりません" },
        { status: 404 }
      );
    }

    await prisma.todoGroup.delete({
      where: {
        userId: user.id, //userIdがuser.idであることを条件追加
        id: todoGroupId,
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
