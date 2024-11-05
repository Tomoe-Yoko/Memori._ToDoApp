import { supabase } from "@/utils/supabase";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const validateUser = async (token: string) => {
  const { error, data } = await supabase.auth.getUser(token);

  if (error) return { user: null, error };

  const supabaseUserId = data.user.id; //supabaseからuseIdを取り出す
  //supabaseUserIdをもとにuserテーブルを見つける↓
  const user = await prisma.users.findUnique({
    where: { supabaseUserId }, //{supabaseUserId:supabaseUserId}同じ名前なら略せる（省略記法keyとvalueが一緒）
  });

  return { user, error };
};
