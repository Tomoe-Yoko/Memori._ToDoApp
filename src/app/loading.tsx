import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center h-screen" aria-label="Now Loading...">
      <div className="animate-spin h-20 w-20 my-52 border-8 border-text_button rounded-full border-b-transparent"></div>
    </div>
  );
};

export default Loading;
