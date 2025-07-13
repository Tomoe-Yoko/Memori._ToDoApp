import { useRouter } from "next/navigation";
import { supabase } from "@/app/_utils/supabase";
import { useUser } from "./useUser";

const useLogout = () => {
  const router = useRouter();
  const { mutate } = useUser();
  const logout = async () => {
    const result = confirm("ログアウトしますか？");
    if (!result) return;

    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("ログアウトに失敗しました");
      throw new Error("Logout error:", error);
    }
    mutate();
    // ログアウト後にホームページなどにリダイレクト
    router.push("/");
  };

  return logout;
};

export default useLogout;
