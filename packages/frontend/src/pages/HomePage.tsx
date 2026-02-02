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

  const [images, setImages] = useState([img1, img2, img3]);

  const handleThumbClick = (index:number) => {
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
        <section className="max-w-6xl mx-auto px-4 pt-4">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={images[1]}
              alt="Banner"
              className="w-full h-80 object-cover"
            />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 group">
              <button
                onClick={prevSlide}
                className="absolute -left-10 top-1/2 -translate-y-1/2
                           bg-black/50 text-white w-8 h-8 rounded-full
                           opacity-0 group-hover:opacity-100
                           transition"
              >
                ‹
              </button>

              <div className="flex gap-3">
                {images.map((img, index) => {
                  const isCenter = index === 1;

                  return (
                    <button
                      key={index}
                      onClick={() => handleThumbClick(index)}
                      className={`relative transition-transform duration-300
                        ${isCenter ? "scale-110" : "scale-95"}
                      `}
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

              <button
                onClick={nextSlide}
                className="absolute -right-10 top-1/2 -translate-y-1/2
                           bg-black/50 text-white w-8 h-8 rounded-full
                           opacity-0 group-hover:opacity-100
                           transition"
              >
                ›
              </button>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-[#0B4A6F] to-[#0E5F8C] text-white py-16">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-10">
            <img
              src="/Homepage_Logo.svg"
              alt="UITVolunteer"
              className="w-52"
            />

            <div>
              <p className="font-semibold text-base leading-relaxed">
                UITVolunteer là một trang web tổng hợp các chiến dịch
                tình nguyện đã và đang được tổ chức tại Trường Đại học
                Công nghệ Thông tin – ĐHQG TP.HCM. Đây là nơi các bạn
                chiến sĩ có thể nhìn lại những chặng đường đã qua,
                cũng như những hình ảnh, bài đăng của từng chiến dịch,
                đồng thời đóng góp những dấu ấn cá nhân của mình.
              </p>

              <h2 className="text-center mt-16 text-3xl font-extrabold tracking-widest">
                CHIẾN DỊCH
              </h2>
            </div>
          </div>


          <div className="mt-16 grid grid-cols-3 gap-16 justify-items-center">
            <div className="w-28 h-28 flex items-center justify-center">
              <img
                src={mhx}
                alt="Mùa hè xanh"
                className="w-24 h-24 object-contain"
              />
            </div>

            <div className="relative group w-28 h-28 flex items-center justify-center">
              <img
                src={xtn}
                alt="Xuân tình nguyện"
                className="w-24 h-24 object-contain"
              />

              <div
                className="absolute -top-6 left-1/2 -translate-x-1/2
                           flex gap-3 bg-white/95 p-2 rounded-xl shadow-lg
                           opacity-0 scale-95 pointer-events-none
                           transition-all duration-300
                           group-hover:opacity-100
                           group-hover:scale-100
                           group-hover:pointer-events-auto"
              >
                {[2024, 2025, 2026].map((year) => (
                  <Link
                    key={year}
                    to={`campaign/xtn/${year}`}
                    className="w-16 h-16 flex items-center justify-center
                               hover:scale-105 transition"
                  >
                    <img
                      src={bndHover}
                      alt={`XTN ${year}`}
                      className="w-full h-full object-contain"
                    />
                  </Link>
                ))}
              </div>
            </div>

            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-28 h-28 bg-white/30 rounded-md flex items-center justify-center"
              >
                <div className="w-12 h-12 border-2 border-white/40 rotate-45" />
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
