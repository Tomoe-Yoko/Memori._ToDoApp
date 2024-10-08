import React from "react";
interface ButtonProps {
  text: string;
}
const Button: React.FC<ButtonProps> = ({ text }) => {
  return (
    <div className="w-full">
      <button
        type="submit"
        className="block w-56 mx-auto mt-16 px-4 py-3 text-text_button border-2 border-text_button rounded-lg  hover:bg-[#fffa] focus:outline-none"
      >
        {text}
      </button>
    </div>
  );
};

export default Button;
