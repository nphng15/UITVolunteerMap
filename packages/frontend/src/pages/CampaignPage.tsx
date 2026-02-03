import { useParams, Link } from "react-router";
import { useEffect, useRef, useState } from "react";
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
import guxuanImg from "@/assets/icons/guxuan.jpg";

const teams = [
  { slug: "truyenthong", name: "Đội hình Truyền Thông", leader: "Phan Thị Kim Ngân", vice: "Hà Yến Linh", image: truyenthongImg },
  { slug: "sukien", name: "Đội hình Sự Kiện", leader: "Nguyễn Quốc Hải", vice: "Hoàng Khôi Nguyên", image: sukienImg },
  { slug: "nhipxuan", name: "Đội hình Nhịp Xuân", leader: "Đỗ Lê Tuấn Kiệt", vice: "Lê Huyền Trân", image: nhipxuanImg },
  { slug: "vidanem", name: "Đội hình Vì Đàn Em", leader: "Lê Nguyễn Hoàng Anh", vice: "Nguyễn Nhất Anh", image: vidanemImg },
  { slug: "xuancongnghe", name: "Đội hình Xuân Công Nghệ", leader: "Nguyễn Hữu Minh Chiến", vice: "Đàm Duy Vũ", image: xuancongngheImg },
  { slug: "vannghexungkich", name: "Đội hình Văn Nghệ Xung Kích", leader: "Trần Thị Phương Viên", vice: "Đỗ Trí Viên", image: vannghexungkichImg },
  { slug: "vixuan", name: "Đội hình Vị Xuân", leader: "Lê Diễm Quỳnh Như", vice: "Trương Tấn Phát", image: vixuanImg },
  { slug: "guxuan", name: "Đội hình Gu Xuân", leader: "Nguyễn Quốc Hải", vice: "Hoàng Khôi Nguyên", image: guxuanImg },
];

const years = ["2026", "2027", "2028"];

export default function CampaignPage() {
  const [activeYear, setActiveYear] = useState("2026");

  return (
    <div className="campaign-page-wrapper">
      <GuestHeader />

      <div className="sidebar-years">
        {years.map((year) => (
          <button
            key={year}
            className={`year-item ${activeYear === year ? "active" : ""}`}
            onClick={() => setActiveYear(year)}
          >
            {year}
          </button>
        ))}
      </div>

      <main className="main-scroll-container">
        <section className="snap-section section-info">
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-white p-3 rounded-xl shadow-lg border-2 border-black aspect-video overflow-hidden mb-10">
              <MapView />
            </div>
            <div className="flex justify-center gap-10 mb-12">
              <img src={bndLogo} className="h-16" />
              <img src={xtnLogo} className="h-20" />
            </div>
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <p className="text-2xl font-bold leading-relaxed text-black">
                Chiến dịch Xuân Tình Nguyện – Trường Đại học Công nghệ Thông tin, ĐHQG-HCM là hoạt động tình nguyện ý nghĩa
                được tổ chức thường niên với sự tham gia của hàng trăm sinh viên thuộc nhiều đội hình khác nhau, với sứ mệnh
                mang không khí và hơi ấm ngày Tết đến với những hoàn cảnh, địa phương còn khó khăn.
              </p>
              <img src={infoImage} className="rounded-3xl shadow-xl" />
            </div>
            <h2 className="text-center font-black text-6xl mt-20 text-black uppercase tracking-widest">Đội Hình</h2>
          </div>
        </section>


        <div className="teams-flow-container">
          <div className="vertical-green-line" />
          
          {teams.map((team, index) => (
            <section key={team.slug} className="snap-section team-item-section">
              <div className="team-container-layout">
                <div className="pin-column">
                  <img src={banhChungPin} className="pin-icon-animated" />
                </div>


                <div className="info-column">
                  <h3 className="team-display-name">{team.name}</h3>
                  <div className="team-lead-info">
                    <p><strong>Đội trưởng:</strong> {team.leader}</p>
                    <p><strong>Đội phó:</strong> {team.vice}</p>
                  </div>
                  <div className="team-visual-block">
                    <div className="img-frame">
                      <img src={team.image} alt={team.name} />
                    </div>
                    <Link to={`team/${team.slug}`} className="btn-view-more">
                      Xem thêm
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        <section className="snap-section">
           <div className="py-20 max-w-6xl mx-auto px-6">
              <h2 className="text-center font-black text-5xl mb-16 text-black">HOẠT ĐỘNG</h2>
              <div className="grid grid-cols-3 gap-8">
                 {[1,2,3].map(i => (
                    <div key={i} className="bg-[#FFD43B] p-6 rounded-3xl shadow-lg h-64 border-2 border-black/10">
                       <h4 className="font-black mb-4">TÊN HOẠT ĐỘNG</h4>
                       <div className="bg-gray-200 w-full h-32 rounded-xl mb-4" />
                    </div>
                 ))}
              </div>
           </div>
           <Footer />
        </section>
      </main>
    </div>
  );
}