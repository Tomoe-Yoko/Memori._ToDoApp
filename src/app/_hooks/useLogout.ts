import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { supabase } from "@/utils/supabase";

const useLogout = () => {
  const router = useRouter();
  const logout = useCallback(async () => {
    const result = confirm("ログアウトしますか？");
    if (!result) return;
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("ログアウトに失敗しました");
      return;
    }
    router.push("/login/");
  }, [router]);
  return logout; // オブジェクトではなく関数を直接返す
};

export default useLogout;
