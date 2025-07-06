// api/todo_group/reorder.ts
import { PrismaClient } from "@prisma/client";
import { supabase } from "@/utils/supabase";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();

export const PUT = async (request: NextRequest) => {
  const token = request.headers.get("Authorization") ?? "";
  const { data, error } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ message: error.message }, { status: 400 });
  const supabaseUserId = data.user.id;
  const user = await prisma.users.findUnique({ where: { supabaseUserId } });
  if (!user)
    return NextResponse.json(
      { message: "ユーザーが見つかりません" },
      { status: 404 }
    );
  const body = await request.json();
  const items: { id: number; sortTabOrder: number }[] = body.items;

  if (!Array.isArray(items)) {
    return NextResponse.json(
      { message: "無効なデータ形式です" },
      { status: 400 }
    );
  }

  try {
    // ③ 自分のタブのうち、更新対象になっているものだけを取得
    const validGroups = await prisma.todoGroup.findMany({
      where: {
        id: { in: items.map((tab) => tab.id) },
        userId: user.id,
      },
    });

    const validIds = new Set(validGroups.map((group) => group.id));

    const updatePromises = items
      .filter((tab) => validIds.has(tab.id))
      .map((tab) =>
        prisma.todoGroup.update({
          where: { id: tab.id },
          data: { sortTabOrder: tab.sortTabOrder },
        })
      );

    await Promise.all(updatePromises);

    return NextResponse.json({ status: "OK" });
  } catch (error) {
    console.error("❌ タブ順更新エラー:", error);
    return NextResponse.json(
      { message: "タブ順の更新に失敗しました", error: String(error) },
      { status: 500 }
    );
  }
};
