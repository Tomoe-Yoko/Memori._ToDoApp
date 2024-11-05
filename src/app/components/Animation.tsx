import React from "react";
import "../globals.css";

interface Props {
  text: string;
}

const Animation: React.FC<Props> = ({ text }) => {
  return (
    <div className="relative max-w-md bg-001 m-auto border-r border-l border-white">
      <div className="animation">
        <p>{text}</p>
      </div>
    </div>
  );
};

export default Animation;
