import { useState } from 'react';

const TimeSelect = () => {
  const [selectedYear, setSelectedYear] = useState('2026');
  const years = ['2024', '2025', '2026', '2027'];

  return (
    <div className="absolute top-10 left-10 flex items-center z-20">
      {/* Container chính */}
      <div className="flex h-12 w-36 items-stretch bg-[#FFF9E5] border-[3px] border-[#660000] rounded-2xl overflow-hidden shadow-md">
        
        {/* Biểu tượng Menu bên trái */}
        <div className="bg-linear-to-b from-[#FFF0AD] to-[#FFD54F] border-r-[3px] border-[#660000] p-3 flex flex-col justify-center gap-1.5 shadow-inner">
          <div className="w-6 h-1 bg-black rounded-full"></div>
          <div className="w-6 h-1 bg-black rounded-full"></div>
          <div className="w-6 h-1 bg-black rounded-full"></div>
        </div>

        {/* Input Select bên phải */}
        <div className="relative flex items-center px-3 py-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="appearance-none bg-transparent text-l font-bold text-black outline-none pr-5 cursor-pointer tracking-tight"
            style={{ fontFamily: 'DVN-Righteous, system-ui, sans-serif' }}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          
          {/* Mũi tên tùy chỉnh (optional - vì ảnh gốc không có nhưng select cần để user biết) */}
          <div className="absolute right-1 pointer-events-none">
            <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSelect;