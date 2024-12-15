import { CreateGalleryItemRequestBody } from "@/app/_type/Gallery";
import { supabase } from "@/utils/supabase";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
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

  const { id } = params;
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
    const galleryItems = await prisma.galleryItems.findMany({
      where: { galleryGroupId },
      orderBy: { createdAt: "asc" }, // 昇順
    });
    return NextResponse.json({ status: "OK", galleryItems });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

///////POST
export const POST = async (
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

  const { id } = params;
  const galleryGroupId = parseInt(id, 10);

  if (isNaN(galleryGroupId)) {
    console.error("Invalid galleryGroupId ID:", id);
    return NextResponse.json(
      { message: "galleryGroupIdが指定されていません。" },
      { status: 400 }
    );
  }

  try {
    //リクエストのbodyを取得
    const body: CreateGalleryItemRequestBody = await request.json();
    //bodyの中から以下を取り出す

    const { galleryGroupId, thumbnailImageKey } = body;
    const data = await prisma.galleryItems.create({
      data: { galleryGroupId, thumbnailImageKey },
    });

    return NextResponse.json({
      status: "OK",
      message: "GalleryItem created successfully",
      id: data.id,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          status: error.message,
        },
        { status: 400 }
      );
    }
  }
};
