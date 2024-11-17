import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <div className="p-4 w-full">
      <h1 className="text-white">
        <Link href="/">Memori.</Link>
      </h1>
    </div>
  );
};

export default Header;
