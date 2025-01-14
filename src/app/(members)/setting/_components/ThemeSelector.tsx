"use client";
import { ThemeColor, themeColors } from "@/app/_type/login";
import React from "react";

interface Props {
  currentTheme: ThemeColor;
  loading: boolean;
  handleThemeChange: (themeId: ThemeColor) => Promise<void>;
}

const ThemeSelector: React.FC<Props> = ({
  currentTheme,
  loading,
  handleThemeChange,
}) => {
  return (
    <div className="grid grid-cols-5 gap-5 mb-12">
      {Object.entries(themeColors).map(([themeId, color]) => {
        const themeKey = themeId as ThemeColor;
        return (
          <div
            key={themeId}
            onClick={() => handleThemeChange(themeKey)}
            className={`${color} w-12 h-12 mx-auto rounded-full cursor-pointer ${
              loading ? "opacity-50 pointer-events-none" : ""
            } ${
              currentTheme === themeKey
                ? "border-4 border-text_button"
                : "border border-gray-300"
            }`}
          ></div>
        );
      })}
    </div>
  );
};

export default ThemeSelector;
