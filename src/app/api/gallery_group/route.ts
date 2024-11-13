import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
// import { supabase } from "@/utils/supabase";

const prisma = new PrismaClient();

///////POST
//リクエストボディの型
interface CreateGalleryGroupRequestBody {
  userId: number;
  galleryGroupTitle: string;
  thumbnailImageKey: string;
}

export const POST = async (request: Request) => {
  try {
    //リクエストのbodyを取得
    const body = await request.json();
    //bodyの中から以下の４つを取り出す
    const {
      galleryGroupTitle,
      thumbnailImageKey,
    }: CreateGalleryGroupRequestBody = body;
    const data = await prisma.calendar.create({
      data: {
        galleryGroupTitle,
        thumbnailImageKey,
      },
    });

    return NextResponse.json({
      status: "OK",
      message: "送信しました",
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
