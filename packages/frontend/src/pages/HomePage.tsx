import { useState } from "react";
import { Link } from "react-router";
import PublicHeader from "@/components/layouts/PublicHeader";
import Footer from "@/components/layouts/Footer";


import img1 from "@/assets/icons/Image Container.png";
import img2 from "@/assets/icons/Image Container (1).png";
import img3 from "@/assets/icons/Image Container (2).png";

import mhx from "@/assets/icons/mhx.png";
import xtn from "@/assets/icons/xtn.png";
import bndHover from "@/assets/icons/bnd ko logo 1.png";

export default function HomePage() {
  const images = [img1, img2, img3];
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () =>
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextSlide = () =>
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="min-h-screen flex flex-col bg-[#0B4A6F]">
      <PublicHeader />

      <main className="flex-1">

        <section className="max-w-6xl mx-auto px-4 pt-4">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={images[currentIndex]}
              alt="Banner"
              className="w-full h-80 object-cover"
            />
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2
                         bg-black/40 text-white w-9 h-9 rounded-full"
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2
                         bg-black/40 text-white w-9 h-9 rounded-full"
            >
              ›
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`border-2 rounded-sm overflow-hidden
                    ${
                      currentIndex === index
                        ? "border-white"
                        : "border-transparent"
                    }`}
                >
                  <img
                    src={img}
                    alt="thumb"
                    className="w-40 h-20 object-contain"
                  />
                </button>
              ))}
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

              <h2 className="text-center mt-14 text-xl font-bold tracking-widest">
                CHIẾN DỊCH
              </h2>
            </div>
          </div>

          <div className="mt-14 flex justify-center gap-28">
            <Link
              to="campaign/mhx"
              className="w-28 aspect-square flex items-center justify-center"
            >
              <img
                src={mhx}
                alt="Mùa hè xanh"
                className="w-24 h-24 object-contain"
              />
            </Link>

            <div className="relative group w-28 aspect-square flex items-center justify-center">
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
