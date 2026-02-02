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
          <div className="relative rounded-b-3xl overflow-hidden">
            <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-full z-10">
              <img
                src="/Homepage_Logo.svg"
                alt="UITVolunteer"
                className="w-32"
              />
            </div>

            <img
              src={images[currentIndex]}
              alt="Banner"
              className="w-full h-80 object-cover"
            />

            <div className="absolute inset-0 bg-[#0B4A6F]/40" />

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2
                         bg-black/50 text-white w-9 h-9 rounded-full z-10"
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2
                         bg-black/50 text-white w-9 h-9 rounded-full z-10"
            >
              ›
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3 z-10">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`border-2 rounded-sm overflow-hidden transition
                    ${
                      currentIndex === index
                        ? "border-white opacity-100"
                        : "border-transparent opacity-50"
                    }`}
                >
                  <img
                    src={img}
                    alt="thumb"
                    className="w-24 h-14 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-[#0B4A6F] to-[#0E5F8C] text-white py-14">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 items-start">
            <img
              src="/Homepage_Logo.svg"
              alt="UITVolunteer"
              className="w-48"
            />

            <div>
              <p className="font-bold text-sm leading-relaxed">
                UITVolunteer là một trang web tổng hợp các chiến dịch
                tình nguyện đã và đang được tổ chức tại Trường Đại học
                Công nghệ Thông tin – ĐHQG TP.HCM. Đây là nơi các bạn
                chiến sĩ có thể nhìn lại những chặng đường đã qua,
                cũng như những hình ảnh, bài đăng của từng chiến dịch,
                đồng thời đóng góp những dấu ấn cá nhân của mình.
              </p>

              <h2 className="text-center mt-12 font-bold tracking-widest">
                CHIẾN DỊCH
              </h2>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-12 justify-items-center">
            {/* MÙA HÈ XANH */}
            <Link
              to="campaign/mhx"
              className="group relative w-24 h-24 flex items-center justify-center"
            >
              <img
                src={mhx}
                alt="Mùa hè xanh"
                className="w-20 h-20 object-contain transition-opacity duration-300
                           group-hover:opacity-0"
              />
              <img
                src={bndHover}
                alt="hover"
                className="absolute inset-0 w-full h-full object-contain
                           opacity-0 transition-opacity duration-300
                           group-hover:opacity-100"
              />
            </Link>

            {/* XUÂN TÌNH NGUYỆN */}
            <Link
              to="campaign/xtn"
              className="group relative w-24 h-24 flex items-center justify-center"
            >
              <img
                src={xtn}
                alt="Xuân tình nguyện"
                className="w-20 h-20 object-contain transition-opacity duration-300
                           group-hover:opacity-0"
              />
              <img
                src={bndHover}
                alt="hover"
                className="absolute inset-0 w-full h-full object-contain
                           opacity-0 transition-opacity duration-300
                           group-hover:opacity-100"
              />
            </Link>

            {/* PLACEHOLDER */}
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-24 h-24 bg-white/30 rounded-md"
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
