import { useParams, Link } from "react-router";
import GuestHeader from "@/components/layouts/GuestHeader";
import Footer from "@/components/layouts/Footer";
import MapView, { MarkerData } from "@/components/layouts/MapView";
import Statistic from "@/components/layouts/Statistic";
import GuestPostOverPlay from "@/components/ui/popups/post/GuestPostOverPlay";
import { mockPost } from "@/mocks/post.mock";
import TimeSelect from "@/components/layouts/TimeSelect";
import { useState } from "react";
import EventCard from "@/components/ui/popups/post/EventCard";

export default function CampaignPage() {
  const { campaignId } = useParams<{ campaignId: string }>();

  const teams = Array.from({ length: 7 });
  const activities = Array.from({ length: 9 });
  const [selectedEvent, setSelectedEvent] = useState<MarkerData | null>(null);

  const handleClose = () => {
    setSelectedEvent(null);
  };

  const [hoverData, setHoverData] = useState<MarkerData | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#BDBDBD]">
      <GuestHeader />
      {hoverData && <EventCard visible={true} data={null} />}{" "}
      {/*Thay null bằng Hover Data nha */}
      {/*hoverData && <EventCard data={hoverData} />*/}
      {selectedEvent && (
        <GuestPostOverPlay post={mockPost} onClose={handleClose} />
      )}
      <main className="flex-1 py-6 mt-14 relative z-0 isolate">
        <section className="max-w-4xl mx-auto px-4">
          <div className="p-3 rounded-md flex">
            <div
              className="relative flex items-center justify-center"
              style={{ width: 450, height: 400 }}
            >
              {/* LỚP 1: MAP - Tự động căn giữa nhờ flex của cha */}
              <div
                className="overflow-hidden"
                style={{
                  width: 350,
                  height: 350,
                  zIndex: 1,
                }}
              >
                <MapView
                  onMarkerClick={(data) => setSelectedEvent(data)}
                  onMarkerHover={(data) => setHoverData(data)}
                />{" "}
                {/* Todo Truyền hàm xử lý sự kiện click marker */}
              </div>

              {/* LỚP 2: FRAME - Đè lên toàn bộ container */}
              <img
                src="/map-element/map-frame-01.svg"
                className="absolute top-0 left-0 pointer-events-none"
                style={{
                  width: 500,
                  //height: 500,
                  zIndex: 10,
                  pointerEvents: "none",
                }}
              />
            </div>
            <Statistic />
          </div>
          <TimeSelect />
        </section>

        <section id="info" className="max-w-4xl mx-auto mt-10 px-4">
          <h2 className="text-center font-black tracking-widest mb-6">
            THÔNG TIN CHUNG CHIẾN DỊCH {campaignId}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <p className="text-sm font-bold leading-relaxed text-black">
              Mô tả chi tiết về chiến dịch.
            </p>

            <div className="bg-[#D9D9D9] aspect-square flex items-center justify-center">
              <div className="w-16 h-16 border-2 border-white rotate-45" />
            </div>
          </div>
        </section>
        <section id="teams" className="max-w-4xl mx-auto mt-12 px-4">
          <h2 className="text-center font-black tracking-widest mb-6">
            ĐỘI HÌNH
          </h2>

          <div className="space-y-5">
            {teams.map((_, i) => (
              <Link
                key={i}
                to={`team/${i + 1}`}
                className="flex bg-[#E6E6E6] rounded-xl overflow-hidden hover:translate-x-1 transition"
              >
                <div className="w-32 bg-[#D9D9D9] flex items-center justify-center">
                  <div className="w-12 h-12 border-2 border-white rotate-45" />
                </div>

                <div className="flex-1 bg-[#FFF2CC] border-l-4 border-red-600 p-4">
                  <h3 className="font-black text-sm mb-1">TÊN ĐỘI HÌNH</h3>
                  <p className="text-xs font-bold text-black mb-2">
                    Mô tả về đội hình.
                  </p>
                  <div className="text-[10px] font-black">
                    Chỉ huy: Tên 1 ; Tên 2 ; Tên 3
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="activities" className="max-w-4xl mx-auto mt-14 px-4">
          <h2 className="text-center font-black tracking-widest mb-6">
            HOẠT ĐỘNG
          </h2>

          <div className="grid grid-cols-3 gap-6">
            {activities.map((_, i) => (
              <div key={i} className="bg-[#FFD966] p-2 rounded-md">
                <div className="text-[10px] font-black mb-1">TÊN HOẠT ĐỘNG</div>

                <div className="bg-[#E6E6E6] aspect-square flex items-center justify-center">
                  <div className="w-10 h-10 border-2 border-white rotate-45" />
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
