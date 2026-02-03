import { useParams, Link } from "react-router";
import { useState, useEffect, useRef } from "react";
import GuestHeader from "@/components/layouts/GuestHeader";
import Footer from "@/components/layouts/Footer";
import MapView from "@/components/layouts/MapView";
import "./CampaignPage.css";

import bndLogo from "@/assets/icons/bnd-ko-logo-1.png";
import xtnLogo from "@/assets/icons/xtn.png";
import infoImage from "@/assets/icons/image-container.png";
import banhChungPin from "@/assets/icons/Formation-pin-slider.png";

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
  { slug: "vixuan", name: "Đội hình Vị Xuân", leader: "Nguyễn Văn L", vice: "Trần Thị M", image: vixuanImg },
  { slug: "maytinhcu", name: "Đội hình Máy Tính Cũ - Tri Thức Mới", leader: "Nguyễn Văn N", vice: "Trần Thị O", image: maytinhcuImg },
  { slug: "guxuan", name: "Đội hình Gu Xuân", leader: "Nguyễn Quốc Hải", vice: "Hoàng Khôi Nguyên", image: guxuanImg },
];

export default function CampaignPage() {
  const { campaignId } = useParams<{ campaignId: string }>();

  const [yearOpen, setYearOpen] = useState(false);
  const [year, setYear] = useState(2026);

  const [activeIndex, setActiveIndex] = useState(0);
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const lockRef = useRef(false);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (lockRef.current) return;
      if (Math.abs(e.deltaY) < 10) return;

      lockRef.current = true;

      let next = activeIndex;
      if (e.deltaY > 0 && activeIndex < teams.length - 1) next++;
      if (e.deltaY < 0 && activeIndex > 0) next--;

      setActiveIndex(next);

      slidesRef.current[next]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      setTimeout(() => {
        lockRef.current = false;
      }, 400);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
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
          <div className="flex justify-center gap-4">
            <img src={bndLogo} className="h-12" />
            <img src={xtnLogo} className="h-14" />
          </div>

          <div className="absolute left-4 top-0 flex gap-2">
            <button
              onClick={() => setYearOpen(!yearOpen)}
              className="bg-[#FFE066] border-2 border-red-700 px-3 py-2 rounded-lg font-black"
            >
              ☰
            </button>

            <div className="bg-[#FFF2CC] border-2 border-red-700 rounded-lg overflow-hidden">
              <div className="px-6 py-2 font-black">{year}</div>
              {yearOpen &&
                [2027, 2028].map((y) => (
                  <button
                    key={y}
                    onClick={() => {
                      setYear(y);
                      setYearOpen(false);
                    }}
                    className="block px-6 py-2 font-black hover:bg-[#FFD966]"
                  >
                    {y}
                  </button>
                ))}
            </div>
          </div>
        </section>

        <section id="info" className="max-w-5xl mx-auto mt-14 px-4">
          <h2 className="text-center font-black mb-10">THÔNG TIN CHUNG</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <p className="font-bold flex items-center">
              Chiến dịch Xuân Tình Nguyện – Trường Đại học Công nghệ Thông tin,
              ĐHQG-HCM là hoạt động tình nguyện ý nghĩa được tổ chức thường niên.
            </p>
            <img src={infoImage} className="rounded-3xl w-full h-full object-cover" />
          </div>
        </section>

        <section id="teams" className="max-w-7xl mx-auto mt-32 px-6 relative">
          <h2 className="text-center font-black text-5xl mb-32">ĐỘI HÌNH</h2>

          <div className="absolute left-6 top-0 bottom-0 w-[4px] bg-green-600" />

          <img
            src={banhChungPin}
            className="timeline-pin"
            style={{ transform: `translateY(${activeIndex * 100}vh)` }}
          />

          {teams.map((team, index) => (
            <div
              key={team.slug}
              ref={(el) => {
                if (el) slidesRef.current[index] = el;
              }}
              className={`team-wrapper ${activeIndex === index ? "active" : ""}`}
            >
              <div className="team-slide pl-28">
                <h3 className="text-5xl text-red-700 mb-4 font-medium">
                  {team.name}
                </h3>

                <div className="flex gap-12 text-2xl mb-10">
                  <span><strong>Đội trưởng:</strong> {team.leader}</span>
                  <span><strong>Đội phó:</strong> {team.vice}</span>
                </div>

                <div className="grid grid-cols-12 gap-12 items-center">
                  <div className="col-span-7">
                    <img src={team.image} className="rounded-[36px]" />
                  </div>
                  <div className="col-span-5">
                    <Link
                      to={`team/${team.slug}`}
                      className="bg-red-700 text-white text-3xl font-black px-14 py-8 rounded-[40px]"
                    >
                      Xem thêm
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

       <section id="activities" className="max-w-5xl mx-auto mt-24 px-4 pb-24">
          <h2 className="text-center font-black tracking-widest mb-12 text-black">
            HOẠT ĐỘNG
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-b from-[#FFE066] to-[#FFD43B] rounded-2xl p-4 shadow-lg"
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

