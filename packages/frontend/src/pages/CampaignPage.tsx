import { useState } from "react";
import Footer from "@/components/layouts/Footer";
import MapView, { MarkerData } from "@/components/layouts/MapView";
import Statistic from "@/components/layouts/Statistic";
import GuestPostOverPlay from "@/components/ui/popups/post/GuestPostOverPlay";
import { mockPost } from "@/mocks/post.mock";
import { mockTeams } from "@/mocks/team.mock";
import TimeSelect from "@/components/layouts/TimeSelect";
import EventCard from "@/components/ui/popups/post/EventCard";
import TeamItem from "@/components/ui/TeamItem";

import bndLogo from "@/assets/icons/bnd-ko-logo-1.png";
import xtnLogo from "@/assets/icons/xtn.png";
import infoImage from "@/assets/icons/image-container.png";

export default function CampaignPage() {
  const [selectedEvent, setSelectedEvent] = useState<MarkerData | null>(null);
  const [hoverData, setHoverData] = useState<MarkerData | null>(null);

  const handleClose = () => {
    setSelectedEvent(null);
  };

  return (
    <div>
      <section className="max-w-4xl mx-auto mt-8 px-4">
          <div className="flex justify-center gap-8">
            <img src={bndLogo} className="h-16 object-contain" alt="BND Logo" />
            <img src={xtnLogo} className="h-20 object-contain" alt="XTN Logo" />
          </div>
      </section>
      {hoverData && <EventCard visible={true} data={null} />}
      {selectedEvent && (
        <GuestPostOverPlay post={mockPost} onClose={handleClose} />
      )}
      <main className="flex-1 pt-20">

        <section className="max-w-4xl mx-auto px-4">
          <div className="p-3 rounded-md flex">
            <div
              className="relative flex items-center justify-center"
              style={{ width: 450, height: 400 }}
            >
              <div
                className="overflow-hidden"
                style={{ width: 350, height: 350, zIndex: 1 }}
              >
                <MapView
                  onMarkerClick={(data) => setSelectedEvent(data)}
                  onMarkerHover={(data) => setHoverData(data)}
                />
              </div>
              <img
                src="/map-element/map-frame-01.svg"
                className="absolute top-0 left-0 pointer-events-none w-125 z-10"
                alt=""
              />
            </div>
            <Statistic />
          </div>
          <TimeSelect />
        </section>

        <section id="info" className="max-w-6xl mx-auto mt-16 px-6">
          <h2 className="text-center font-black text-black mb-12 text-5xl">
            THÔNG TIN CHUNG
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <p className="text-black text-2xl font-bold leading-relaxed">
              Chiến dịch Xuân Tình Nguyện – Trường Đại học Công nghệ Thông tin,
              ĐHQG-HCM là hoạt động tình nguyện ý nghĩa được tổ chức thường niên
              với sự tham gia của hàng trăm sinh viên thuộc nhiều đội hình khác
              nhau, với sứ mệnh mang không khí và hơi ấm ngày Tết đến với những
              hoàn cảnh, địa phương còn khó khăn.
            </p>
            <img
              src={infoImage}
              className="rounded-3xl shadow-xl w-full"
              alt="Volunteer"
            />
          </div>
        </section>

        <section id="teams" className="max-w-7xl mx-auto mt-32 px-10 relative">
          <h2 className="text-center font-black text-6xl mb-24 text-black">
            ĐỘI HÌNH
          </h2>

          {/* Vertical line */}
          <div className="absolute left-25 top-67.5 bottom-10 w-2 bg-green-600 z-1 rounded-lg" />

          {/* Teams list */}
          <div className="relative z-2">
            {mockTeams.map((team, index) => (
              <TeamItem key={`${team.slug}-${index}`} team={team} />
            ))}
          </div>
        </section>

        <section id="activities" className="max-w-6xl mx-auto mt-32 px-6 pb-32">
          <h2 className="text-center font-black text-5xl mb-16 text-black tracking-widest">
            HOẠT ĐỘNG
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-linear-to-b from-[#FFE066] to-[#FFD43B] rounded-3xl p-6 shadow-xl"
              >
                <h3 className="font-black text-xl text-black mb-4 uppercase">
                  Tên hoạt động
                </h3>
                <div className="bg-[#E6E6E6] rounded-2xl aspect-4/3 flex items-center justify-center mb-4">
                  <div className="w-16 h-16 border-4 border-white rotate-45 opacity-40" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-red-600 text-2xl">❤</span>
                  <div className="flex-1 h-0.75 bg-black/60 rounded-full" />
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
