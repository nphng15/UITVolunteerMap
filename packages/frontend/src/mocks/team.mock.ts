import type { TeamData } from "@/components/ui/TeamItem";

import truyenthongImg from "@/assets/icons/truyenthong.jpg";
import sukienImg from "@/assets/icons/sukien.jpg";
import nhipxuanImg from "@/assets/icons/nhipxuan.jpg";
import vidanemImg from "@/assets/icons/vidanem.jpg";
import xuancongngheImg from "@/assets/icons/xuancongnghe.jpg";
import vannghexungkichImg from "@/assets/icons/vannghexungkich.jpg";
import vixuanImg from "@/assets/icons/vixuan.jpg";
import maytinhcuImg from "@/assets/icons/maytinhcu.jpg";
import guxuanImg from "@/assets/icons/guxuan.jpg";

export const mockTeams: TeamData[] = [
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
