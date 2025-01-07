import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
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
      console.error("Logout error:", error.message);
      return;
    }
    // mutate(() => true, undefined, { revalidate: false });
    mutate();
    // ログアウト後にホームページなどにリダイレクト
    router.push("/");
  };

  return logout;
};

export default useLogout;
