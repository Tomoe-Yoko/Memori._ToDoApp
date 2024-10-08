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
    //postCategoryにも生成
    // 本来複数同時生成には、createManyというメソッドがあるが、sqliteではcreateManyが使えないので、for文1つずつ実施

    // for (const category of categories) {
    //   //postCategory` テーブルに新しいエントリを作成するためのメソッド↓
    //   await prisma.postCategory.create({
    //     data: {
    //       categoryId: category.id,
    //       postId: data.id,
    //     },
    //   });
    // }
    //レスポンスを返す
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
