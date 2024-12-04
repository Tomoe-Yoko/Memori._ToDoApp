import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { supabase } from "@/utils/supabase";
import { Weekly } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
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
      { message: "ユーザーが見つかりませんでした" },
      { status: 404 }
    );

  try {
    const dayString = params.id; // URLパスから'id'を取得

    // 型ガードを使用して文字列を列挙型に変換
    const weekday = Object.values(Weekly).includes(dayString as Weekly)
      ? (dayString as Weekly)
      : undefined;

    if (!weekday) {
      return NextResponse.json(
        { message: "無効な曜日が指定されました" },
        { status: 400 }
      );
    }

    const routineWork = await prisma.routineWork.findMany({
      where: {
        userId: user.id,
        weekly: weekday, // 曜日でフィルタリング
      },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ status: "OK", routineWork });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 400 });
  }
};
