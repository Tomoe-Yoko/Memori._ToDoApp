import React from "react";
interface Props {
  handleAddEvent: () => void;
}
const PlusButton: React.FC<Props> = ({ handleAddEvent }) => {
  return (
    <div onClick={handleAddEvent} className="w-full flex justify-end mr-4">
      <button className="w-[55px] fixed bottom-[80px] mr-3 aspect-square rounded-full bg-[#787878] text-white text-xl">
        ＋
      </button>
    </div>
  );
};

export default PlusButton;
