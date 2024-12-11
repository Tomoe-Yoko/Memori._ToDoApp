"use Client";

import React from "react";
// import PlusButton from "../_components/PlusButton";
import Navigation from "../_components/Navigation";
import { Toaster } from "react-hot-toast";
import Tab from "./_components/Tab";

const page = () => {
  ///////// Tag

  return (
    // img
    <div>
      <Tab />

      {/* <PlusButton handleAddEvent={addImg} /> */}
      <Navigation />
      <Toaster position="top-center" />
    </div>
  );
};

export default page;
