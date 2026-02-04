import { Link } from "react-router";
import { useEffect, useRef, useState } from "react";
import GuestHeader from "@/components/layouts/GuestHeader";
import Footer from "@/components/layouts/Footer";
import MapView, { MarkerData } from "@/components/layouts/MapView";
import Statistic from "@/components/layouts/Statistic";
import GuestPostOverPlay from "@/components/ui/popups/post/GuestPostOverPlay";
import { mockPost } from "@/mocks/post.mock";
import TimeSelect from "@/components/layouts/TimeSelect";
import EventCard from "@/components/ui/popups/post/EventCard";

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
  {
    slug: "truyenthong",
    name: "Đội hình Truyền Thông",
    leader: "Phan Thị Kim Ngân",
    vice: "Hà Yến Linh",
    image: truyenthongImg,
  },
  {
    slug: "sukien",
    name: "Đội hình Sự Kiện",
    leader: "Phan Mạnh Tân",
    vice: "Nguyễn Vũ Phúc, Hoàng Xuân Minh Trí",
    image: sukienImg,
  },
  {
    slug: "nhipxuan",
    name: "Đội hình Nhịp Xuân",
    leader: "Đỗ Lê Tuấn Kiệt",
    vice: "Lê Huyền Trân",
    image: nhipxuanImg,
  },
  {
    slug: "vidanem",
    name: "Đội hình Vì Đàn Em",
    leader: "Lê Nguyễn Hoàng Anh",
    vice: "Nguyễn Nhất Anh",
    image: vidanemImg,
  },
  {
    slug: "xuancongnghe",
    name: "Đội hình Xuân Công Nghệ",
    leader: "Nguyễn Hữu Minh Chiến",
    vice: "Đàm Duy Vũ",
    image: xuancongngheImg,
  },
  {
    slug: "vannghexungkich",
    name: "Đội hình Văn Nghệ Xung Kích",
    leader: "Trần Thị Phương Viên",
    vice: "Đỗ Trí Viên",
    image: vannghexungkichImg,
  },
  {
    slug: "vixuan",
    name: "Đội hình Vị Xuân",
    leader: "Lê Diễm Quỳnh Như",
    vice: "Trương Tấn Phát",
    image: vixuanImg,
  },
  {
    slug: "maytinhcu",
    name: "Đội hình Máy Tính Cũ - Tri Thức Mới",
    leader: "Lê Diễm Quỳnh Như",
    vice: "Trương Tấn Phát",
    image: maytinhcuImg,
  },
  {
    slug: "guxuan",
    name: "Đội hình Gu Xuân",
    leader: "Nguyễn Quốc Hải",
    vice: "Hoàng Khôi Nguyên",
    image: guxuanImg,
  },
];

interface TeamItemProps {
  team: (typeof teams)[0];
}

const TeamItem = ({ team }: TeamItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(0);
  const [translateY, setTranslateY] = useState(50);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Fade in from bottom, fade out at top
      let newOpacity = 1;
      if (rect.top > windowHeight * 0.7) {
        // Entering from bottom
        newOpacity = Math.max(
          0,
          1 - (rect.top - windowHeight * 0.7) / (windowHeight * 0.3),
        );
      } else if (rect.bottom < windowHeight * 0.3) {
        // Exiting at top
        newOpacity = Math.max(0, rect.bottom / (windowHeight * 0.3));
      }

      // Translate effect (slide up as it appears)
      const newTranslateY =
        rect.top > windowHeight * 0.7
          ? Math.min(50, (rect.top - windowHeight * 0.7) / 5)
          : 0;

      setOpacity(newOpacity);
      setTranslateY(newTranslateY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="flex items-start mb-24 transition-all duration-300 ease-out"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {/* Pin */}
      <div className="w-35 mr-10 shrink-0 flex justify-center relative z-10">
        <img
          src={banhChungPin}
          alt="pin"
          className="w-27.5 h-auto drop-shadow-lg transition-transform duration-500 hover:scale-110 hover:rotate-[5deg]"
        />
      </div>

      {/* Content */}
      <div className="grow pt-2">
        <h3 className="text-[3.5rem] font-black text-red-700 mb-2 leading-none">
          {team.name}
        </h3>
        <div className="flex gap-10 text-2xl font-bold text-black mb-6">
          <span>
            <strong>Đội trưởng:</strong> {team.leader}
          </span>
          <span>
            <strong>Đội phó:</strong> {team.vice}
          </span>
        </div>
        <div className="flex gap-10 items-center">
          {/* Image */}
          <div className="flex-7 rounded-[35px] overflow-hidden shadow-2xl group">
            <img
              src={team.image}
              alt={team.name}
              className="w-full block transition-transform duration-500 group-hover:scale-[1.08]"
            />
          </div>
          {/* Button */}
          <div className="flex-3">
            <Link
              to={`team/${team.slug}`}
              className="inline-block bg-red-700 text-white text-2xl font-extrabold py-5 px-16 rounded-full shadow-[0_15px_35px_rgba(185,28,28,0.4)] transition-all duration-300 hover:bg-rose-600 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(185,28,28,0.5)] whitespace-nowrap"
            >
              Xem thêm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CampaignPage() {
  const [selectedEvent, setSelectedEvent] = useState<MarkerData | null>(null);
  const [hoverData, setHoverData] = useState<MarkerData | null>(null);

  const handleClose = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDE7B5]">
      <GuestHeader />
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
            {teams.map((team, index) => (
              <TeamItem
                key={`${team.slug}-${index}`}
                team={team}
              />
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
