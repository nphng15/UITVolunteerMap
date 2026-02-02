import { useParams, Link } from "react-router";
import { useState } from "react";
import GuestHeader from "@/components/layouts/GuestHeader";
import Footer from "@/components/layouts/Footer";
import MapView from "@/components/layouts/MapView";

import bndLogo from "@/assets/icons/bnd-ko-logo-1.png";
import xtnLogo from "@/assets/icons/xtn.png";
import infoImage from "@/assets/icons/image-container.png";

export default function CampaignPage() {
  const { campaignId } = useParams<{ campaignId: string }>();

  const teams = Array.from({ length: 7 });
  const activities = Array.from({ length: 9 });

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

          <div className="absolute left-4 top-0">
            <button
              onClick={() => setYearOpen(!yearOpen)}
              className="flex items-center gap-2 bg-white px-3 py-1 rounded border font-bold text-sm"
            >
              ☰ {year}
            </button>

            {yearOpen && (
              <div className="mt-1 bg-white border rounded shadow">
                {[2026, 2027, 2028].map((y) => (
                  <button
                    key={y}
                    onClick={() => {
                      setYear(y);
                      setYearOpen(false);
                    }}
                    className="block px-4 py-1 text-sm hover:bg-gray-100 w-full text-left"
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="info" className="max-w-4xl mx-auto mt-10 px-4">
          <h2 className="text-center font-black tracking-widest mb-6">
            THÔNG TIN CHUNG
          </h2>

          <div className="grid md:grid-cols-2 gap-6 items-center">
            <p className="text-sm font-bold leading-relaxed">
              Chiến dịch Xuân Tình Nguyện – Trường Đại học Công nghệ Thông tin,
              ĐHQG-HCM là hoạt động tình nguyện ý nghĩa được tổ chức thường niên
              với sự tham gia của hàng trăm sinh viên thuộc nhiều đội hình khác
              nhau, với sứ mệnh mang không khí và hơi ấm ngày Tết đến với những
              hoàn cảnh, địa phương còn khó khăn.
            </p>

            <img
              src={infoImage}
              className="rounded-lg border-4 border-white"
            />
          </div>
        </section>

        <section id="teams" className="max-w-4xl mx-auto mt-14 px-4">
          <h2 className="text-center font-black tracking-widest mb-6">
            ĐỘI HÌNH
          </h2>

          <div className="space-y-5">
            {teams.map((_, i) => (
              <Link
                key={i}
                to={`team/${i + 1}`}
                className="flex bg-[#FFF2CC] rounded-xl overflow-hidden hover:translate-x-1 transition"
              >
                <div className="w-32 bg-[#E6E6E6] flex items-center justify-center">
                  <div className="w-12 h-12 border-2 border-white rotate-45" />
                </div>

                <div className="flex-1 border-l-4 border-red-600 p-4">
                  <h3 className="font-black text-sm mb-1">
                    TÊN ĐỘI HÌNH
                  </h3>
                  <p className="text-xs font-bold mb-2">
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

        <section id="activities" className="max-w-4xl mx-auto mt-16 px-4 mb-20">
          <h2 className="text-center font-black tracking-widest mb-8">
            HOẠT ĐỘNG
          </h2>

          <div className="grid grid-cols-3 gap-6">
            {activities.map((_, i) => (
              <div
                key={i}
                className="bg-[#FFD966] rounded-xl p-3 shadow"
              >
                <div className="text-[10px] font-black mb-1">
                  TÊN HOẠT ĐỘNG
                </div>

                <div className="bg-[#E6E6E6] aspect-square rounded flex items-center justify-center">
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
