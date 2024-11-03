import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/utils/supabase";
import { PrismaClient, ScheduleColor } from "@prisma/client";

const prisma = new PrismaClient();

// export const GET = async (
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) => {
//   const token = request.headers.get("Authorization") ?? "";
//   const { error } = await supabase.auth.getUser(token);
//   if (error) {
//     return NextResponse.json({ status: error.message }, { status: 400 });
//   }
//   const { id } = params;
//   try {
//     const calendar = await prisma.calendar.findUnique({
//       where: {
//         id: parseInt(id),
//       },
//     });
//     return NextResponse.json({ status: "OK", calendar }, { status: 200 });
//   } catch (error) {
//     if (error instanceof Error) {
//       return NextResponse.json({ status: error.message }, { status: 400 });
//     }
//   }
// };

//////POST
// export const POST = async (request: Request) => {
//   const token = request.headers.get("Authorization") ?? "";
//   const { error, data } = await supabase.auth.getUser(token);
//   if (error) return Response.json({ status: error.message }, { status: 400 });

//   const supabaseUserId = data.user.id;
//   const user = await prisma.users.findUnique({ where: { supabaseUserId } });
//   if (!user)
//     return NextResponse.json(
//       { message: "ユーザーが見つかりませんでした" },
//       { status: 404 }
//     );
// };

///////PUT
interface UpdateCalendarRequestBody {
  scheduleDate: string;
  content: string;
  scheduleColor: ScheduleColor;
  createdAt: string;
  updatedAt: string;
}
export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const token = request.headers.get("Authorization") ?? "";
  const { error, data } = await supabase.auth.getUser(token);
  if (error) {
    console.error("Authorization error:", error.message);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  const supabaseUserId = data.user.id;
  const user = await prisma.users.findUnique({ where: { supabaseUserId } });
  if (!user) {
    console.error("User not found for ID:", supabaseUserId);
    return NextResponse.json(
      { message: "ユーザーが見つかりませんでした" },
      { status: 404 }
    );
  }

  const { id } = params;
  const calendarId = parseInt(id);
  if (isNaN(calendarId)) {
    console.error("Invalid calendar ID:", id);
    return NextResponse.json({ message: "無効なIDです" }, { status: 400 });
  }

  const body: UpdateCalendarRequestBody = await request.json();
  const { scheduleDate, content, scheduleColor, createdAt, updatedAt } = body;

  try {
    const existingCalendar = await prisma.calendar.findUnique({
      where: { id: calendarId },
    });

    if (!existingCalendar) {
      console.error("Calendar entry not found for ID:", calendarId);
      return NextResponse.json(
        { message: "更新するレコードが見つかりません" },
        { status: 404 }
      );
    }

    const calendar = await prisma.calendar.update({
      where: {
        id: calendarId,
      },
      data: {
        scheduleDate: new Date(scheduleDate),
        content,
        scheduleColor,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
      },
    });

    console.log("Calendar entry updated for ID:", calendarId);
    return NextResponse.json({ status: "OK", calendar }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating calendar entry:", error.message);
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};

// /////DELETE
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
  const calendarId = parseInt(id);
  if (isNaN(calendarId)) {
    console.error("Invalid calendar ID:", id);
    return NextResponse.json({ message: "無効なIDです" }, { status: 400 });
  }

  try {
    const calendar = await prisma.calendar.findUnique({
      where: { id: calendarId },
    });

    if (!calendar) {
      console.error("Calendar entry not found for ID:", calendarId);
      return NextResponse.json(
        { message: "削除するレコードが見つかりません" },
        { status: 404 }
      );
    }

    await prisma.calendar.delete({
      where: { id: calendarId },
    });
    console.log("Calendar entry deleted for ID:", calendarId);
    return NextResponse.json({ status: "OK" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error deleting calendar entry:", error.message);
      return NextResponse.json({ status: error.message }, { status: 400 });
      // console.log(error.message);
    }
  }
};
