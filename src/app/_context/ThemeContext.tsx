// // ThemeContext.tsx
// import React, {
//   createContext,
//   useContext,
//   useState,
//   ReactNode,
//   useEffect,
// } from "react";
// import { useSupabaseSession } from "../_hooks/useSupabaseSession"; // Supabaseのセッションフックをインポート
// import { LoginUserData, ThemeColor, themeColors } from "../_type/login";
// // import { ThemeColorId } from "@prisma/client";

// type ThemeContextType = {
//   themeColor: ThemeColor;
//   setThemeColor: (color: ThemeColor) => void;
// };

// export const ThemeContext = createContext<ThemeContextType>({
//   themeColor: ThemeColor.Theme01,
//   setThemeColor: () => {},
// });
// //ユーザーのテーマカラーを取得する関数
// const fetchUserThemeColor = async (token: string): Promise<ThemeColor> => {
//   // API呼び出しをしてユーザーのテーマカラーを取得する
//   const response = await fetch("/api/login", {
//     headers: { "Content-Type": "application/json", Authorization: token! },
//   });
//   if (!response.ok) {
//     throw new Error("Failed to fetch user theme color");
//   }

//   const data: LoginUserData = await response.json();

//   const themeColorId = data.themeColor as ThemeColor;

//   // themeColorsにthemeColorIdが存在するか確認
//   if (!themeColors[themeColorId]) {
//     throw new Error(`Invalid theme color ID: ${themeColorId}`);
//   }
//   return themeColorId;
// };

// export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const { token, isLoading } = useSupabaseSession(); // ログイン状態とトークンを取得
//   const [themeColor, setThemeColor] = useState<ThemeColor>(ThemeColor.Theme01); // デフォルトの背景色

//   useEffect(() => {
//     const initializeThemeColor = async () => {
//       if (isLoading || !token)
//         return (document.body.style.backgroundColor = "");
//       try {
//         const userThemeColor = await fetchUserThemeColor(token);
//         setThemeColor(userThemeColor);
//       } catch (error) {
//         console.error("Error fetching user theme color:", error);
//       }
//     };

//     initializeThemeColor();
//     document.body.style.backgroundColor = themeColors[themeColor];
//   }, [token, isLoading, themeColor]); // コンポーネントがマウントされたときに一度だけ実行

//   return (
//     <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error("useTheme must be used within a ThemeProvider");
//   }
//   return context;
// };
