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
import maytinhcuImg from "@/assets/icons/maytinhcu.jpg";
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

const TeamItem = ({ team }: { team: typeof teams[0] }) => {
  const [isInView, setIsInView] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      className={`team-wrapper ${isInView ? "is-in-view" : ""}`}
    >
      <div className="team-pin-wrapper">
        <img src={banhChungPin} alt="pin" className="pin-icon" />
      </div>

      <div className="team-slide">
        <h3 className="team-title">{team.name}</h3>
        <div className="team-info">
          <span><strong>Đội trưởng:</strong> {team.leader}</span>
          <span><strong>Đội phó:</strong> {team.vice}</span>
        </div>
        <div className="team-content">
          <div className="image-container">
            <img src={team.image} alt={team.name} />
          </div>
          <div className="button-container">
            <Link to={`team/${team.slug}`} className="team-btn">
              Xem thêm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CampaignPage() {
  const { campaignId } = useParams<{ campaignId: string }>();

  return (
    <div className="min-h-screen flex flex-col bg-[#FDE7B5]">
      <GuestHeader />

      <main className="flex-1 pt-20">
        <section className="max-w-4xl mx-auto px-4">
          <div className="bg-white p-3 rounded-md shadow-sm">
            <div className="border-4 border-black aspect-video overflow-hidden">
              <MapView />
            </div>
          </div>
        </section>

   
        <section className="max-w-4xl mx-auto mt-8 px-4">
          <div className="flex justify-center gap-8">
            <img src={bndLogo} className="h-16 object-contain" alt="BND Logo" />
            <img src={xtnLogo} className="h-20 object-contain" alt="XTN Logo" />
          </div>
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
            <img src={infoImage} className="rounded-3xl shadow-xl w-full" alt="Volunteer" />
          </div>
        </section>

        <section id="teams" className="max-w-7xl mx-auto mt-32 px-10 relative">
          <h2 className="text-center font-black text-6xl mb-24 text-black">
            ĐỘI HÌNH
          </h2>

          <div className="team-line" />

          <div className="teams-list">
            {teams.map((team) => (
              <TeamItem key={team.slug} team={team} />
            ))}
          </div>
        </section>

        <section id="activities" className="max-w-6xl mx-auto mt-32 px-6 pb-32">
          <h2 className="text-center font-black text-5xl mb-16 text-black tracking-widest">
            HOẠT ĐỘNG
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gradient-to-b from-[#FFE066] to-[#FFD43B] rounded-3xl p-6 shadow-xl">
                <h3 className="font-black text-xl text-black mb-4 uppercase">Tên hoạt động</h3>
                <div className="bg-[#E6E6E6] rounded-2xl aspect-[4/3] flex items-center justify-center mb-4">
                  <div className="w-16 h-16 border-4 border-white rotate-45 opacity-40" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-red-600 text-2xl">❤</span>
                  <div className="flex-1 h-[3px] bg-black/60 rounded-full" />
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