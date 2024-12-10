import React from "react";

interface AllClearRoutine {
  clearAllChecks: () => void;
  isAnimating: boolean;
  allChecked: boolean;
}

const AllClearButton: React.FC<AllClearRoutine> = ({
  clearAllChecks,
  isAnimating,
  allChecked,
}) => {
  return (
    <div className="w-full">
      <button
        disabled={isAnimating}
        onClick={() => clearAllChecks()}
        className={`block w-56 mx-auto px-4 py-1 text-text_button border-2 border-text_button rounded-2xl focus:outline-none ${
          allChecked ? "bg-text_button text-white" : ""
        }`}
      >
        全部できた！
        <br />
        <span className="text-xs">全チェックをクリアにする</span>
      </button>
    </div>
  );
};

export default AllClearButton;
