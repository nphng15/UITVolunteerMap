import { useParams, Link } from "react-router";
import { useState, useEffect, useRef } from "react";
import GuestHeader from "@/components/layouts/GuestHeader";
import Footer from "@/components/layouts/Footer";
import MapView from "@/components/layouts/MapView";

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

    if (e.deltaY > 5 && activeIndex < teams.length - 1) {
      locked = true;
      setActiveIndex(i => i + 1);
    }

    if (e.deltaY < -5 && activeIndex > 0) {
      locked = true;
      setActiveIndex(i => i - 1);
    }

    setTimeout(() => (locked = false), 200);
  };

  el.addEventListener("wheel", onWheel, { passive: true });
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

          <div className="absolute left-4 top-0 z-30 flex items-start gap-2">
              <button
                onClick={() => setYearOpen(!yearOpen)}
                className="flex items-center gap-2
                          bg-[#FFF2CC]
                          border-2 border-red-700
                          px-3 py-2
                          rounded-lg
                          font-black
                          text-black"
              >
                ☰ {year}
              </button>

              {yearOpen && (
                <div
                  className="flex flex-col
                            bg-[#FFF2CC]
                            border-2 border-red-700
                            rounded-xl
                            overflow-hidden
                            shadow-lg"
                >
                  {[2026, 2027, 2028].map((y) => (
                    <button
                      key={y}
                      onClick={() => {
                        setYear(y);
                        setYearOpen(false);
                      }}
                      className={`px-6 py-2 font-black text-lg text-black
                        ${
                          year === y
                            ? "bg-[#FFD966]"
                            : "hover:bg-[#FFE8A1]"
                        }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}
            </div>


        </section>

       <section id="info" className="max-w-5xl mx-auto mt-14 px-4">
          <h2 className="text-center font-black tracking-widest mb-10 text-black">
            THÔNG TIN CHUNG
          </h2>

          <div className="grid md:grid-cols-2 gap-10 items-stretch">
            <p className="text-base font-bold leading-relaxed text-black flex items-center">
              Chiến dịch Xuân Tình Nguyện – Trường Đại học Công nghệ Thông tin,
              ĐHQG-HCM là hoạt động tình nguyện ý nghĩa được tổ chức thường niên
              với sự tham gia của hàng trăm sinh viên thuộc nhiều đội hình khác
              nhau, với sứ mệnh mang không khí và hơi ấm ngày Tết đến với những
              hoàn cảnh, địa phương còn khó khăn.
            </p>

            <img
              src={infoImage}
              className="rounded-3xl object-cover w-full h-full"
            />
          </div>
        </section>

        <section id="teams" className="max-w-6xl mx-auto mt-24 px-4">
            <h2 className="text-center font-black tracking-widest mb-14 text-black">
              ĐỘI HÌNH
            </h2>

            <div
              ref={timelineRef}
              className="relative border-l-[3px] border-green-600 pl-8
                        h-[720px] overflow-hidden"
            >
              {teams.map((team, index) => {
                const offset = (index - activeIndex) * 260;

                return (
                  <div
                    key={team.slug}
                    className="absolute left-0 right-0 transition-all duration-300"
                    style={{
                      transform: `translateY(calc(50% + ${offset}px))`,
                      opacity: Math.abs(index - activeIndex) > 1 ? 0 : 1,
                    }}
                  >
                    <img
                      src={banhChungPin}
                      className="absolute -left-[34px] top-6 w-9 h-9"
                    />

                    <div className="flex items-center gap-8 bg-[#FDE7B5]">
                      <img
                        src={team.image}
                        className="w-[420px] rounded-[32px] object-cover"
                      />

                      <div className="flex-1">
                        <h3 className="font-black text-3xl text-red-700 mb-3">
                          {team.name}
                        </h3>

                        <p className="text-lg font-bold text-black mb-1">
                          Đội trưởng: {team.leader}
                        </p>
                        <p className="text-lg font-bold text-black mb-6">
                          Đội phó: {team.vice}
                        </p>

                        <Link
                          to={`team/${team.slug}`}
                          className="inline-block bg-red-700 text-white
                                    text-xl font-black
                                    px-10 py-5 rounded-3xl"
                        >
                          Xem thêm
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>



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
