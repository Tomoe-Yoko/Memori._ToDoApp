// ThemeContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type ThemeContextType = {
  themeColor: string;
  setThemeColor: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

//ユーザーのテーマカラーを取得する関数
const fetchUserThemeColor = async (): Promise<string> => {
  // API呼び出しをしてユーザーのテーマカラーを取得する
  const response = await fetch("/api/user/theme-color");
  if (!response.ok) {
    throw new Error("Failed to fetch user theme color");
  }
  const data = await response.json();
  return data.themeColor; // 取得したテーマカラーを返す
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [themeColor, setThemeColor] = useState<string>("#E4C8CE"); // デフォルトの背景色

  useEffect(() => {
    const initializeThemeColor = async () => {
      try {
        const userThemeColor = await fetchUserThemeColor();
        setThemeColor(userThemeColor);
      } catch (error) {
        console.error("Error fetching user theme color:", error);
      }
    };

    initializeThemeColor();
  }, []); // コンポーネントがマウントされたときに一度だけ実行

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
