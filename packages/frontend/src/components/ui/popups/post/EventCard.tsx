import React, { useState, useEffect, useRef } from 'react';

// 1. Định nghĩa Mock Data
const MOCK_EVENT_DATA = {
  title: "Vị Xuân 7",
  subtitle: "Trạm dừng chân đầu tiên – Vườn Cau Đỏ",
  description: "Vườn Cau Đỏ không đơn thuần là một trạm dừng chân, mà là chuyến tàu đưa ta ngược dòng về quá khứ. Nơi đây từng là căn cứ địa cách mạng kiên cường của vùng An Phú Đông – Thạnh Lộc.",
  image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=500&q=80" // Ảnh minh họa phong cảnh
};

interface EventData {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
}

interface EventCardProps {
  visible: boolean;
  data: EventData | null;
}

const EventCard: React.FC<EventCardProps> = ({ visible, data }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // 2. Ưu tiên data từ props, nếu không có thì dùng Mock Data
  const displayData = data && Object.keys(data).length > 0 ? data : MOCK_EVENT_DATA;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!visible) return;

      let x = e.clientX + 20;
      let y = e.clientY + 20;

      // Giới hạn khung hình
      if (x + 288 > window.innerWidth) x = e.clientX - 288 - 20;
      if (y + 350 > window.innerHeight) y = e.clientY - 350 - 20;

      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [visible]);

  if (!visible) return null;

  return (
    <div 
      ref={cardRef}
      className="fixed z-[9999] w-72 overflow-hidden rounded-[30px] shadow-2xl bg-[#FFF5DE] border-2 border-[#660000]/10 pointer-events-none transition-transform duration-75 ease-out"
      style={{ 
        left: `${mousePos.x}px`, 
        top: `${mousePos.y}px`,
      }}
    >
      {/* Thumbnail với hiệu ứng Overlay nhẹ */}
      <div className="h-36 bg-[#DDE1E6] relative overflow-hidden">
        <img 
          src={displayData.image} 
          alt={displayData.title} 
          className="w-full h-full object-cover shadow-inner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1 tracking-tight">
          {displayData.title}
        </h2>
        
        <p className="text-[#ED7A2D] text-[12px] font-bold uppercase tracking-widest mb-2">
          {displayData.subtitle?.split('–')[0]} {/* Lấy phần trước dấu gạch ngang */}
        </p>

        <p className="text-gray-700 text-[12px] leading-relaxed mb-4 line-clamp-3 italic">
          "{displayData.description}"
        </p>

        <button className="bg-[#ED7A2D] hover:bg-[#d66a24] text-white font-bold py-2 px-8 rounded-full text-[11px] shadow-lg transition-colors uppercase">
          Xem chi tiết
        </button>
      </div>

      {/* Trang trí góc (Optional - cho giống style skeuomorphic) */}
      <div className="absolute top-2 right-4 w-2 h-2 bg-white/50 rounded-full shadow-sm"></div>
    </div>
  );
};

export default EventCard;