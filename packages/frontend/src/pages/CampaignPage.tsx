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
              className="bg-[#FFE066] border-2 border-red-700 px-3 py-2 rounded-lg font-black"
            >
              ☰
            </button>

            <div className="flex flex-col border-2 border-red-700 rounded-lg overflow-hidden bg-[#FFF2CC]">
              <div className="px-6 py-2 font-black text-lg text-black">
                {year}
              </div>

              {yearOpen && [2027, 2028].map((y) => (
                <button
                  key={y}
                  onClick={() => {
                    setYear(y);
                    setYearOpen(false);
                  }}
                  className="px-6 py-2 font-black text-lg text-black hover:bg-[#FFD966]"
                >
                  {y}
                </button>
              ))}
            </div>
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

            <img src={infoImage} className="rounded-3xl object-cover w-full h-full" />
          </div>
        </section>

        <section id="teams" className="max-w-7xl mx-auto mt-32 px-6 relative">
          <h2 className="text-center font-black text-5xl mb-40 text-black">
            ĐỘI HÌNH
          </h2>

          <div className="absolute left-6 top-0 bottom-0 w-[4px] bg-green-600" />

          <div className="space-y-64">
            {teams.map((team) => {
              const ref = useRef<HTMLDivElement>(null);

              useEffect(() => {
                const el = ref.current;
                if (!el) return;

                const slide = el.querySelector(".team-slide");
                if (!slide) return;

                const observer = new IntersectionObserver(
                  ([entry]) => {
                    if (entry.isIntersecting) {
                      slide.classList.add("active");
                    } else {
                      slide.classList.remove("active");
                    }
                  },
                  { threshold: 0.4 }
                );

                observer.observe(el);
                return () => observer.disconnect();
              }, []);

              return (
                <div
                  key={team.slug}
                  ref={ref}
                  className="team-wrapper relative min-h-screen"
                >
                  <img
                    src={banhChungPin}
                    className="absolute left-6 top-0 -translate-x-1/2 w-24 h-24 z-10"
                  />

                  <div className="team-slide pl-24">
                    <h3 className="font-black text-5xl text-red-700 mb-6">
                      {team.name}
                    </h3>

                    <p className="text-2xl font-bold text-black mb-2">
                      Đội trưởng: {team.leader}
                    </p>
                    <p className="text-2xl font-bold text-black mb-12">
                      Đội phó: {team.vice}
                    </p>

                    <div className="grid grid-cols-12 gap-12 items-center">
                      <div className="col-span-7">
                        <img
                          src={team.image}
                          className="w-full rounded-[36px] object-cover"
                        />
                      </div>

                      <div className="col-span-5 flex justify-start">
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
              );
            })}
          </div>
        </section>

        <section id="activities" className="max-w-5xl mx-auto mt-24 px-4 pb-24">
          <h2 className="text-center font-black tracking-widest mb-12 text-black">
            HOẠT ĐỘNG
          </h2>
        </section>
      </main>

      <Footer />
    </div>
  );
}
