import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const getCurrentUser = async (request: NextRequest) => {
  const token = request.headers.get("Authorization")!;
  const { data, error } = await supabase.auth.getUser(token);
  // 送ったtokenが合ってるかどうか
  return { currentUser: data, error };
};
