import { useState } from "react";
import { Link } from "react-router";
import PublicHeader from "@/components/layouts/PublicHeader";
import Footer from "@/components/layouts/Footer";

import img1 from "@/assets/icons/image-container.png";
import img2 from "@/assets/icons/image-container-1.png";
import img3 from "@/assets/icons/image-container-2.png";

import mhx from "@/assets/icons/mhx.png";
import xtn from "@/assets/icons/xtn.png";
import bndHover from "@/assets/icons/bnd-ko-logo-1.png";

export default function HomePage() {
  const [images, setImages] = useState<string[]>([img1, img2, img3]);

  const handleThumbClick = (index: number) => {
    if (index === 1) return;
    setImages((imgs) => {
      const selected = imgs[index];
      const others = imgs.filter((_, i) => i !== index);
      return [others[0], selected, others[1]];
    });
  };

  const prevSlide = () => {
    setImages(([a, b, c]) => [b, c, a]);
  };

  const nextSlide = () => {
    setImages(([a, b, c]) => [c, a, b]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B4A6F]">
      <PublicHeader />

      <main className="flex-1">
        <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <div className="relative w-full overflow-hidden group">
            <div className="relative w-full aspect-[24/9]">
            <img
              src={images[1]}
              alt="Banner"
              className="w-full h-full object-cover object-center"
            />
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2
                         bg-black/40 text-white w-9 h-9 rounded-full
                         opacity-0 group-hover:opacity-100 transition"
            >
              ‹
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2
                         bg-black/40 text-white w-9 h-9 rounded-full
                         opacity-0 group-hover:opacity-100 transition"
            >
              ›
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
              {images.map((img, index) => {
                const isCenter = index === 1;
                return (
                  <button
                    key={index}
                    onClick={() => handleThumbClick(index)}
                    className={`relative transition-transform duration-300 ${
                      isCenter ? "scale-110" : "scale-95"
                    }`}
                  >
                    <img
                      src={img}
                      alt="thumb"
                      className="w-32 h-14 object-cover rounded-sm"
                    />
                    {!isCenter && (
                      <div className="absolute inset-0 bg-black/50 rounded-sm" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-[#0B4A6F] to-[#0E5F8C] text-white py-20">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-10">
            <img src="/Homepage_Logo.svg" className="w-56" />
            <p className="font-semibold text-base leading-relaxed">
              UITVolunteer là một trang web tổng hợp các chiến dịch tình nguyện đã
              và đang được tổ chức tại Trường Đại học Công nghệ Thông tin – ĐHQG
              TP.HCM. Đây là nơi các bạn chiến sĩ có thể nhìn lại những chặng
              đường đã qua, cũng như những hình ảnh, bài đăng của từng chiến
              dịch, đồng thời đóng góp những dấu ấn cá nhân của mình.
            </p>
          </div>

          <h2 className="text-center mt-24 mb-20 text-3xl font-extrabold tracking-widest">
            CHIẾN DỊCH
          </h2>

          <div className="max-w-4xl mx-auto grid grid-cols-2 gap-24 place-items-center">
            <div className="flex flex-col items-center gap-6">
              <img src={mhx} className="w-40 h-40 object-contain" />
            </div>

            <div className="relative group flex flex-col items-center gap-6">
                <Link to="/campaign/xtn">
                  <img
                    src={xtn}
                    className="w-40 h-40 object-contain cursor-pointer"
                    alt="Xuân Tình Nguyện"
                  />
                </Link>

                <div
                  className="absolute -top-6 left-1/2 -translate-x-1/2
                            flex gap-3 bg-white/95 p-2 rounded-xl shadow-lg
                            opacity-0 scale-95 pointer-events-none
                            transition-all duration-300
                            group-hover:opacity-100
                            group-hover:scale-100
                            group-hover:pointer-events-auto"
                >
                  {[2024, 2025, 2026].map((y) => (
                    <Link
                      key={y}
                      to={`/campaign/xtn/${y}`}
                      className="w-16 h-16"
                    >
                      <img
                        src={bndHover}
                        className="w-full h-full object-contain"
                        alt={`XTN ${y}`}
                      />
                    </Link>
                  ))}
                </div>
              </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
