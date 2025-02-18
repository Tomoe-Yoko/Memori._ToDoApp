import React from "react";
interface ButtonProps {
  text: string;
  // size?: "large" | "middle" | "small";
  size?: "middle" | "small" | "tiny";
  bgColor?: "normal" | "delete";
}
const Button: React.FC<ButtonProps> = ({
  text,
  size = "middle",
  bgColor = "normal",
}) => {
  // サイズに応じたクラスを設定
  const sizeClasses = {
    // large: "w-64 py-4 text-lg", // 大きいサイズ
    middle: "w-56 py-3 text-base", // （デフォルト）
    small: "w-32 py-3 text-sm", // 小さいサイズ
    tiny: "w-18 px-4 py-2 text-sm",
  };

  const bgColors = {
    normal: "hover:bg-[#eeea] ", // （デフォルト）
    delete: "text-white bg-trash_bg hover:bg-[#C86262aa] ",
  };
  return (
    <div className="w-full">
      <button
        type="submit"
        className={`block mx-auto px-4 text-text_button border-2 border-text_button rounded-lg  focus:outline-none ${sizeClasses[size]} ${bgColors[bgColor]}`}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;
