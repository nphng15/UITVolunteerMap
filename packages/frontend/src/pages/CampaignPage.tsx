import { useParams, Link } from "react-router";
import { useState, useEffect, useRef } from "react";
import GuestHeader from "@/components/layouts/GuestHeader";
import Footer from "@/components/layouts/Footer";
import MapView from "@/components/layouts/MapView";

import bndLogo from "@/assets/icons/bnd-ko-logo-1.png";
import xtnLogo from "@/assets/icons/xtn.png";
import infoImage from "@/assets/icons/image-container.png";
import banhChungPin from "@/assets/icons/bnd-ko-logo-1.png";

import truyenthongImg from "@/assets/icons/truyenthong.jpg";
import sukienImg from "@/assets/icons/sukien.jpg";
import nhipxuanImg from "@/assets/icons/nhipxuan.jpg";
import vidanemImg from "@/assets/icons/vidanem.jpg";
import xuancongngheImg from "@/assets/icons/xuancongnghe.jpg";
import vannghexungkichImg from "@/assets/icons/vannghexungkich.jpg";
import vixuanImg from "@/assets/icons/vixuan.jpg";
import maytinhcuImg from "@/assets/icons/maytinhcu.jpg";
import guxuanImg from "@/assets/icons/guxuan.jpg";

const teams = [
  { slug: "truyenthong", name: "Đội hình Truyền Thông", leader: "Phan Thị Kim Ngân", vice: "Hà Yến Linh", image: truyenthongImg },
  { slug: "sukien", name: "Đội hình Sự Kiện", leader: "Nguyễn Văn A", vice: "Trần Thị B", image: sukienImg },
  { slug: "nhipxuan", name: "Đội hình Nhịp Xuân", leader: "Nguyễn Văn C", vice: "Trần Thị D", image: nhipxuanImg },
  { slug: "vidanem", name: "Đội hình Vì Đàn Em", leader: "Nguyễn Văn E", vice: "Trần Thị F", image: vidanemImg },
  { slug: "xuancongnghe", name: "Đội hình Xuân Công Nghệ", leader: "Nguyễn Văn G", vice: "Trần Thị H", image: xuancongngheImg },
  { slug: "vannghexungkich", name: "Đội hình Văn Nghệ Xung Kích", leader: "Nguyễn Văn I", vice: "Trần Thị K", image: vannghexungkichImg },
  { slug: "vixuan", name: "Đội hình Vì Xuân", leader: "Nguyễn Văn L", vice: "Trần Thị M", image: vixuanImg },
  { slug: "maytinhcu", name: "Đội hình Máy Tính Cũ", leader: "Nguyễn Văn N", vice: "Trần Thị O", image: maytinhcuImg },
  { slug: "guxuan", name: "Đội hình Gửi Xuân", leader: "Nguyễn Quốc Hải", vice: "Hoàng Khôi Nguyên", image: guxuanImg },
];

export default function CampaignPage() {
  const { campaignId } = useParams<{ campaignId: string }>();

  const [yearOpen, setYearOpen] = useState(false);
  const [year, setYear] = useState(2026);

  const [activeIndex, setActiveIndex] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;

    let locked = false;

    const onWheel = (e: WheelEvent) => {
      if (locked) return;

      if (e.deltaY > 0 && activeIndex < teams.length - 1) {
        locked = true;
        setActiveIndex((i) => i + 1);
      }

      if (e.deltaY < 0 && activeIndex > 0) {
        locked = true;
        setActiveIndex((i) => i - 1);
      }

      setTimeout(() => (locked = false), 450);
    };

    el.addEventListener("wheel", onWheel);
    return () => el.removeEventListener("wheel", onWheel);
  }, [activeIndex]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDE7B5]">
      <GuestHeader />

      <main className="flex-1 pt-20">

        <section className="max-w-4xl mx-auto px-4">
          <div className="bg-white p-3 rounded-md">
            <div className="border-4 border-black aspect-video overflow-hidden">
              <MapView />
            </div>
          </div>
        </section>
        <section className="max-w-4xl mx-auto mt-8 px-4 relative">
          <div className="flex justify-center items-center gap-4">
            <img src={bndLogo} className="h-12" />
            <img src={xtnLogo} className="h-14" />
          </div>

          <div className="absolute left-4 top-0">
            <button
              onClick={() => setYearOpen(!yearOpen)}
              className="flex items-center gap-2 bg-[#FFF2CC] text-black border-2 border-black px-3 py-1 rounded-md font-black text-sm"
            >
              ☰ {year}
            </button>

            {yearOpen && (
              <div className="mt-1 bg-[#FFF2CC] border-2 border-black rounded shadow">
                {[2026, 2027, 2028].map((y) => (
                  <button
                    key={y}
                    onClick={() => {
                      setYear(y);
                      setYearOpen(false);
                    }}
                    className="block px-4 py-1 text-sm font-bold text-black hover:bg-[#FFD966] w-full text-left"
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="info" className="max-w-4xl mx-auto mt-10 px-4">
          <h2 className="text-center font-black tracking-widest mb-6 text-black">
            THÔNG TIN CHUNG
          </h2>

          <div className="grid md:grid-cols-2 gap-6 items-center">
            <p className="text-sm font-bold leading-relaxed text-black">
              Chiến dịch Xuân Tình Nguyện – Trường Đại học Công nghệ Thông tin,
              ĐHQG-HCM là hoạt động tình nguyện ý nghĩa được tổ chức thường niên
              với sự tham gia của hàng trăm sinh viên thuộc nhiều đội hình khác
              nhau, với sứ mệnh mang không khí và hơi ấm ngày Tết đến với những
              hoàn cảnh, địa phương còn khó khăn.
            </p>

            <img src={infoImage} className="rounded-lg border-4 border-white" />
          </div>
        </section>
        <section id="teams" className="max-w-5xl mx-auto mt-20 px-4">
          <h2 className="text-center font-black tracking-widest mb-12 text-black">
            ĐỘI HÌNH
          </h2>

          <div className="relative flex">
            <div className="w-1/4 bg-[#FFE5B4] rounded-xl mr-8" />

            <div
              ref={timelineRef}
              className="relative flex-1 border-l-[4px] border-[#4FA3FF] pl-16 py-20"
            >
              {teams.map((team, index) => (
                <div
                  key={team.slug}
                  className="relative mb-32 transition-all duration-500"
                  style={{
                    opacity: index === activeIndex ? 1 : 0,
                    transform:
                      index === activeIndex
                        ? "translateY(0)"
                        : "translateY(40px)",
                    pointerEvents:
                      index === activeIndex ? "auto" : "none",
                  }}
                >

                  <img
                    src={banhChungPin}
                    className="absolute -left-[56px] top-10 w-10 h-10"
                  />

                  <div className="flex bg-[#FFF2CC] rounded-2xl overflow-hidden shadow-xl">
                    <img src={team.image} className="w-52 object-cover" />

                    <div className="flex-1 p-6 border-l-4 border-red-600">
                      <h3 className="font-black text-xl text-red-700 mb-2">
                        {team.name}
                      </h3>

                      <p className="text-sm font-bold text-black">
                        Đội trưởng: {team.leader}
                      </p>
                      <p className="text-sm font-bold text-black mb-4">
                        Đội phó: {team.vice}
                      </p>

                      <Link
                        to={`team/${team.slug}`}
                        className="inline-block bg-red-700 text-white text-xs font-black px-5 py-2 rounded-full hover:bg-red-800"
                      >
                        Xem thêm
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOẠT ĐỘNG */}
<section
  id="activities"
  className="max-w-5xl mx-auto mt-24 px-4 pb-24"
>
  <h2 className="text-center font-black tracking-widest mb-12 text-black">
    HOẠT ĐỘNG
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="bg-gradient-to-b from-[#FFE066] to-[#FFD43B]
                   rounded-2xl p-4 shadow-lg"
      >
        <h3 className="font-black text-sm text-black mb-3">
          TÊN HOẠT ĐỘNG
              </h3>

              <div className="bg-[#E6E6E6] rounded-xl aspect-[4/3] flex items-center justify-center mb-3">
                <div className="w-12 h-12 border-2 border-white rotate-45 opacity-60" />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-red-600 text-sm">❤</span>
                <div className="flex-1 h-[2px] bg-black/70" />
              </div>
            </div>
          ))}
        </div>
      </section>

      </main>

      <Footer />
    </div>
  );
}
