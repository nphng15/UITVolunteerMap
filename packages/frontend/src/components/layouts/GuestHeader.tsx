import { Link } from "react-router";
import { useEffect, useState } from "react";

export default function GuestHeader() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const sections = ["info", "teams", "activities"];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        threshold: 0.6, 
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

type NavItemProps = {
  id: string;
  label: string;
};

const navItem = ({ id, label }: NavItemProps) => (
  <a href={`#${id}`}>{label}</a>
);

  return (
    <header className="w-full bg-white border-b border-black/10 fixed top-0 z-50">
      <div className="max-w-6xl mx-auto h-14 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xs text-gray-700">
          <span>✉</span>
          <span>Logo chiến dịch</span>
        </div>

        <nav className="flex gap-10 text-xs font-bold text-black">
          {navItem({ id: "info", label: "Thông tin" })}
          {navItem({ id: "teams", label: "Đội hình" })}
          {navItem({ id: "activities", label: "Hoạt động" })}

        </nav>

        <Link
          to="/login"
          className="text-xs font-bold px-3 py-1 border border-black/20 rounded hover:bg-gray-100"
        >
          Đăng nhập
        </Link>
      </div>
    </header>
  );
}
