import React from "react";

import bgTop from "@/assets/background/background_top-01.svg";
import bgBottom from "@/assets/background/background_bottom-01.svg";
import bgCloud from "@/assets/background/background_star_cloud-01.svg";

import Footer from "@/components/layouts/Footer";

interface Props {
  children: React.ReactNode;
}

export default function BackgroundLayout({ children }: Props) {
  return (
    <div className="relative bg-[#FCDEAE] flex flex-col min-h-screen">

      {/* Top decorations */}
      <img
        src={bgTop}
        alt="background top"
        className="absolute top-0 left-0 w-full z-10 pointer-events-none"
      />

      <img
        src={bgCloud}
        alt="cloud and star"
        className="absolute top-0 left-0 w-full z-20 pointer-events-none"
      />

      {/* Nội dung chính */}
      <div className="relative z-30 flex-1">
        {children}
      </div>

      {/* Hình bottom */}
      <div className="-mb-[1px] z-10 leading-none">
        <img
          src={bgBottom}
          alt="background bottom"
          className="w-full block m-0 p-0 align-bottom"
        />
      </div>

      {/* Footer phải nằm sau bottom */}
      <Footer />

    </div>
  );
}
