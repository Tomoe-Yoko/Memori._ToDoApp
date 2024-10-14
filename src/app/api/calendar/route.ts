import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { CreatePostRequestBody } from "@/app/_type/Calendar";
// import { supabase } from "@/utils/supabase";

const prisma = new PrismaClient();

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const {
      userId,
      scheduleDate,
      content,
      scheduleColor,
      createdAt,
      updatedAt,
    }: CreatePostRequestBody = body;

    const data = await prisma.calendar.create({
      data: {
        userId,
        scheduleDate,
        content,
        scheduleColor,
        createdAt,
        updatedAt,
      },
    });

    // if (!userId || !scheduleDate || !content || !scheduleColor) {
    //   return NextResponse.json(
    //     { error: "情報を取得できませんでした。" },
    //     { status: 400 }
    //   );
    // }
    // const { error } = await supabase.from("Calendar").insert([
    //   {
    //     userId,
    //     scheduleDate,
    //     content,
    //     scheduleColor,
    //   },
    // ]);
    // if (error) {
    //   return NextResponse.json({ error: error.message }, { status: 400 });
    // }
    return NextResponse.json({
      status: "OK",
      message: "Calendar entry created successfully",
      id: data.id,
    });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json(
        { error: "Failed to create calendar entry" },
        { status: 400 }
      );
  }
};
