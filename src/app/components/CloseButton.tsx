import React from "react";
import { AiOutlineClose } from "react-icons/ai";

interface CloseButtonProps {
  onClick: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label="閉じる"
      className="text-gray-500 hover:text-gray-700 transition-colors"
    >
      <AiOutlineClose size={24} />
    </button>
  );
};

export default CloseButton;
