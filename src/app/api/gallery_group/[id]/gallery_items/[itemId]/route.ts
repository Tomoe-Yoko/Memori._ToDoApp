import { PrismaClient } from "@prisma/client";
import { supabase } from "@/app/_utils/supabase";
import { NextResponse, NextRequest } from "next/server";
import { CreateGalleryItemRequestBody } from "@/app/_type/Gallery";

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

  const galleryGroupId = parseInt(params.id, 10);
  const galleryItemId = parseInt(params.itemId, 10);

  if (isNaN(galleryGroupId) || isNaN(galleryItemId))
    return NextResponse.json(
      { message: "目的のギャラリータブが指定されていません。" },
      { status: 400 }
    );
  try {
    await prisma.galleryItems.delete({
      where: { id: galleryItemId },
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

  const putGalleryItemId = parseInt(params.itemId, 10);
  if (isNaN(putGalleryItemId))
    return NextResponse.json(
      {
        message:
          "目的のギャラリーリストまたはギャラリータブが指定されていません。",
      },
      { status: 400 }
    );
  const body: CreateGalleryItemRequestBody = await request.json();
  const { thumbnailImageKey } = body;

  try {
    const editingGalleryItem = await prisma.galleryItems.update({
      where: {
        id: putGalleryItemId,
        galleryGroup: { user: { supabaseUserId } },
      },
      data: { thumbnailImageKey },
    });
    return NextResponse.json(
      { status: "OK", editingGalleryItem },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error }, { status: 400 });
  }
};
