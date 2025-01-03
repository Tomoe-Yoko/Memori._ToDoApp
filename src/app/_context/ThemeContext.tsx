// ThemeContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useSupabaseSession } from "../_hooks/useSupabaseSession"; // Supabaseのセッションフックをインポート

type ThemeContextType = {
  themeColor: string;
  setThemeColor: (color: string) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  themeColor: "Theme01",
  setThemeColor: () => {},
});

//ユーザーのテーマカラーを取得する関数
const fetchUserThemeColor = async (token: string): Promise<string> => {
  // API呼び出しをしてユーザーのテーマカラーを取得する
  const response = await fetch("/api/login", {
    headers: { "Content-Type": "application/json", Authorization: token! },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user theme color");
  }
  const data = await response.json();
  return data.themeColor; // 取得したテーマカラーを返す
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { token, isLoading } = useSupabaseSession(); // ログイン状態とトークンを取得
  const [themeColor, setThemeColor] = useState<string>("Theme01"); // デフォルトの背景色

  useEffect(() => {
    const initializeThemeColor = async () => {
      if (isLoading || !token) return; // ロード中またはトークンがない場合は何もしない
      try {
        const userThemeColor = await fetchUserThemeColor(token);
        setThemeColor(userThemeColor);
      } catch (error) {
        console.error("Error fetching user theme color:", error);
      }
    };

    initializeThemeColor();
  }, [token, isLoading]); // コンポーネントがマウントされたときに一度だけ実行

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
