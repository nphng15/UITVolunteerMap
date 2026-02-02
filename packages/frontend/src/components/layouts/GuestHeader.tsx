import { Link } from "react-router";
import { useEffect, useState, useRef } from "react";

import bndLogo from "@/assets/icons/bnd-ko-logo-1.png";
import xtnLogo from "@/assets/icons/xtn.png";

const SECTIONS = ["info", "teams", "activities"] as const;
type SectionId = (typeof SECTIONS)[number];

export default function GuestHeader() {
  const [active, setActive] = useState<SectionId | null>("info");
  const isClickingRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickingRef.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id as SectionId);
          }
        });
      },
      {
        rootMargin: "-90px 0px -50% 0px",
        threshold: 0,
      }
    );

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (id: SectionId) => {
    isClickingRef.current = true;
    setActive(id);

    setTimeout(() => {
      isClickingRef.current = false;
    }, 400);
  };

          const navItem = (id: SectionId, label: string) => (
          <a
            href={`#${id}`}
            onClick={() => handleClick(id)}
            className="
              relative text-sm font-black text-black
              transition-all duration-200
              hover:text-red-600
              hover:scale-105
              group
            "
          >
            {label}

            <span
              className="
                absolute -bottom-2 left-0
                h-[3px] w-0
                bg-red-600
                transition-all duration-200
                group-hover:w-full
              "
            />
          </a>
        );


  return (
    <header
      className="
        fixed top-0 left-0 right-0
        z-[9999]
        bg-[#F5B311]
        border-b-2 border-black/20
      "
    >
      <div className="max-w-6xl mx-auto h-16 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={bndLogo} className="h-8" />
          <img src={xtnLogo} className="h-9" />
        </div>


        <nav className="flex gap-16 group">
          {navItem("info", "Thông tin")}
          {navItem("teams", "Đội hình")}
          {navItem("activities", "Hoạt động")}
        </nav>

        <Link
          to="/login"
          className="text-sm font-black px-4 py-1 rounded
                     border-2 border-black
                     hover:bg-black hover:text-white transition"
        >
          Đăng nhập
        </Link>
      </div>
    </header>
  );
}
