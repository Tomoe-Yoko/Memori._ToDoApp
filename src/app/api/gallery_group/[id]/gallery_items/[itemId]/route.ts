import { PrismaClient } from "@prisma/client";
import { supabase } from "@/utils/supabase";
import { NextResponse, NextRequest } from "next/server";
import { CreateGalleryItemRequestBody } from "@/app/_type/Gallery";

const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string; key: string } }
) => {
  const token = request.headers.get("Authorization") ?? "";
  const { data, error } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });
  const supabaseUserId = data.user.id;
  const user = await prisma.users.findUnique({ where: { supabaseUserId } });

  if (!user)
    return NextResponse.json(
      { message: "ユーザーが見つかりませんでした" },
      { status: 404 }
    );

  const { id, key } = params;
  const galleryGroupId = parseInt(id, 10);
  if (isNaN(galleryGroupId))
    return NextResponse.json(
      { message: "目的のタブが指定されていません。" },
      { status: 400 }
    );
  try {
    const galleryGroup = await prisma.galleryGroup.findUnique({
      where: { id: galleryGroupId, userId: user.id },
    });
    if (!galleryGroup)
      return NextResponse.json(
        { message: "galleryタブがみつかりません。" },
        { status: 404 }
      );
    const galleryItem = await prisma.galleryItems.findMany({
      where: { galleryGroupId, thumbnailImageKey: key },
      orderBy: { createdAt: "asc" }, // 昇順
    });
    if (!galleryItem) {
      return NextResponse.json(
        { message: "ギャラリーアイテムが見つかりません。" },
        { status: 404 }
      );
    }
    return NextResponse.json({ status: "OK", galleryItem });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

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

  const galleryGroupId = parseInt(params.id, 10);
  const galleryItemId = parseInt(params.itemId, 10);

  if (isNaN(galleryGroupId) || isNaN(galleryItemId))
    return NextResponse.json(
      { message: "目的のギャラリータブが指定されていません。" },
      { status: 400 }
    );

  try {
    await prisma.galleryItems.delete({
      where: {
        id: galleryItemId,
        galleryGroup: {
          user: { supabaseUserId },
        },
      },
    });

    return NextResponse.json({ status: "OK", galleryItemId });
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

  const putGalleryGroupId = parseInt(params.id, 10);
  const putGalleryItemId = parseInt(params.itemId, 10);
  if (isNaN(putGalleryGroupId) || isNaN(putGalleryItemId))
    return NextResponse.json(
      {
        message:
          "目的のギャラリーリストまたはギャラリータブが指定されていません。",
      },
      { status: 400 }
    );
  const body: CreateGalleryItemRequestBody = await request.json();
  const { galleryGroupId, thumbnailImageKey } = body;

  // todoGroupIdがnullまたはundefinedでないことを確認
  if (galleryGroupId == null) {
    return NextResponse.json(
      { message: "ギャラリータブが指定されていません。" },
      { status: 400 }
    );
  }

  try {
    const editingTodoItem = await prisma.galleryItems.update({
      where: {
        id: putGalleryItemId,
        galleryGroup: { user: { supabaseUserId } },
      },
      data: { galleryGroupId, thumbnailImageKey },
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
