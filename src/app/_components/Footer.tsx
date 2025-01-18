import React from "react";

const Footer = () => {
  return (
    //CSS FOOTER一番下にする
    <div className="flex justify-center items-end p-4 border-r border-l border-white">
      <footer className="py-6 row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-4 text-text_button hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          &copy;Memori
        </a>
      </footer>
    </div>
  );
};

export default Footer;
