import { CreateGalleryGroupRequestBody } from "@/app/_type/Gallery";
import { supabase } from "@/app/_utils/supabase";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

///////PUT
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
  const galleryGroupId = parseInt(id);

  if (isNaN(galleryGroupId))
    return NextResponse.json({ message: "無効なIDです" }, { status: 400 });
  const body: CreateGalleryGroupRequestBody = await request.json();
  const { galleryGroupTitle } = body;
  try {
    const editingGalleryTitle = await prisma.galleryGroup.update({
      where: {
        userId: user.id,
        id: galleryGroupId,
      },
      data: {
        galleryGroupTitle,
      },
    });
    return NextResponse.json(
      { status: "OK", editingGalleryTitle },
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

  // トークンが無効または期限切れの場合の処理
  if (error) {
    return NextResponse.json(
      { message: "認証エラー: " + error.message },
      { status: 401 }
    );
  }

  const supabaseUserId = data.user.id;
  const user = await prisma.users.findUnique({ where: { supabaseUserId } });
  if (!user)
    return NextResponse.json(
      { message: "ユーザーが見つかりませんでした" },
      { status: 404 }
    );

  const { id } = params;
  const galleryGroupId = parseInt(id);
  if (isNaN(galleryGroupId)) {
    console.error("Invalid galleryGroupId ID:", id);
    return NextResponse.json({ message: "無効なIDです" }, { status: 400 });
  }

  try {
    await prisma.galleryGroup.delete({
      where: {
        userId: user.id,
        id: galleryGroupId,
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
