const Statistic = () => {
  const stats = [
    { num: "268", label: "Chiến sĩ" },
    { num: "9", label: "Đội hình" },
    { num: "4", label: "Địa bàn" }
  ];

  return (
    <div className="flex flex-col gap-2 pl-12 justify-center">
    {stats.map((item, index) => (
        <div key={index} className="flex items-center">
        
        {/* CỘT SỐ: Cố định độ rộng và ép nội dung sang phải */}
        <div className="flex justify-end w-[120px] mr-6 justify-center"> 
            <span className="stats-number text-[80px] b">
            {item.num}
            </span>
        </div>

        {/* CỘT CHỮ: Căn lề trái tự nhiên */}
        <div className="flex-1">
            <span className="stats-label text-[35px] uppercase">
            {item.label}
            </span>
        </div>

        </div>
    ))}
    </div>
  );
};

export default Statistic;