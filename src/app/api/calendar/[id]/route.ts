import { supabase } from "@/utils/supabase";
import { PrismaClient } from "@prisma/client";

import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const token = request.headers.get("Authorization") ?? "";
  const { error } = await supabase.auth.getUser(token);
  if (error) {
    return NextResponse.json({ status: error.message }, { status: 400 });
  }
  const { id } = params;
  try {
    const calendar = await prisma.calendar.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    return NextResponse.json({ status: "OK", calendar }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};

//////POST
export const POST = async (request: Request) => {
  const token = request.headers.get("Authorization") ?? "";
  const { error, data } = await supabase.auth.getUser(token);
  if (error) return Response.json({ status: error.message }, { status: 400 });

  const supabaseUserId = data.user.id;
  const user = await prisma.users.findUnique({ where: { supabaseUserId } });
  if (!user)
    return NextResponse.json(
      { message: "ユーザーが見つかりませんでした" },
      { status: 404 }
    );
};

// /////PUT
// export const PUT = async (request: Request) => {
//   const token = request.headers.get("Authorization") ?? "";
//   const { error, data } = await supabase.auth.getUser(token);
//   if (error)
//     return NextResponse.json({ message: error.message }, { status: 400 });
//   const supabaseUserId = data.user.id;
//   const user = await prisma.users.findUnique({ where: { supabaseUserId } });
//   if (!user)
//     return NextResponse.json(
//       { message: "ユーザーが見つかりませんでした" },
//       { status: 404 }
//     );
// };

// /////DELETE
// export const DELETE = async (request: NextRequest) => {
//   const token = request.headers.get("Authorization") ?? "";
//   const { error, data } = await supabase.auth.getUser(token);
//   if (error)
//     return NextResponse.json({ message: error.message }, { status: 400 });
//   const supabaseUserId = data.user.id;
//   const user = await prisma.users.findUnique({ where: { supabaseUserId } });
//   if (!user)
//     return NextResponse.json(
//       { message: "ユーザーが見つかりませんでした" },
//       { status: 404 }
//     );
// };
