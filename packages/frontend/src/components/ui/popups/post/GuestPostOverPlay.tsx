import { useState, useEffect } from "react";
import ShareIcon from "@/components/ui/icon/ShareIcon";
import ArrowLeft from "@/components/ui/icon/ArrowLeft";
import ArrowRight from "@/components/ui/icon/ArrowRight";

// types/post.ts (hoặc ngay trong file)
export interface Post {
  id: number | string;
  title: string;
  caption: string;
  images: string[];
  createdAt: string;
  location?: string;
}


interface GuestPostOverlayProps {
  post: Post | null;
  onClose?: () => void;
}

export default function GuestPostOverPlay( { post, onClose }: GuestPostOverlayProps) {
  const { title, caption, images = [], createdAt, location } = post || {};
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // Reset slider khi mở post mới
    setCurrent(0);
  }, [post?.id]);

  if (!post) return null;

  const next = () =>
    setCurrent((current + 1) % images.length);

  const prev = () =>
    setCurrent((current - 1 + images.length) % images.length);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 text-black" onClick={onClose}>
        <div className="w-[1000px] h-[650px] bg-white rounded-lg overflow-hidden flex" onClick={(e) => e.stopPropagation()}>

            {/* LEFT - IMAGE SLIDER */}
            <div className="relative w-[50%] bg-black flex items-center justify-center">
            {images.length > 0 && (
                <img
                src={images[current]}
                alt=""
                className="w-full h-full object-cover"
            />)}
            {images.length > 1 && (
            <>
            {/* Prev */}
            <button
                onClick={prev}
                className="
                    absolute left-4 top-1/2 -translate-y-1/2
                    w-10 h-10
                    bg-white
                    rounded-full
                    flex items-center justify-center
                    text-black text-2xl
                    shadow-md
                    hover:scale-105
                    active:scale-95
                    transition
                "
                >
                <ArrowLeft />
            </button>

            {/* Next */}
            <button
                onClick={next}
                className="
                    absolute right-4 top-1/2 -translate-y-1/2
                    w-10 h-10
                    bg-white
                    rounded-full
                    flex items-center justify-center
                    text-black text-2xl
                    shadow-md
                    hover:scale-105
                    active:scale-95
                    transition
                "
                >
                <ArrowRight />
            </button>
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`w-2 h-2 rounded-full ${current === index ? "bg-white" : "bg-white/40"}`}
                  />
                ))}
            </div>
            </>)}
        </div>

        {/* RIGHT - POST CONTENT */}
        <div className="w-[50%] flex flex-col border-l bg-[#FCF2DA]">

            {/* Header */}
            <div className="flex items-center gap-3 p-2 mt-10 mx-5">
                <span className="font-semibold text-3xl">{title}</span>
            </div>

            {/* Caption */}
            <div className="flex-1 p-2 overflow-y-auto text-sm mx-5">
              {caption}
            </div>

            {/* Footer */}
            <div className="p-2 text-sm text-gray-500 mx-5">
                {/* Actions */}
                <div className="flex items-center gap-4 mb-3">
                    {/* Share icon */}
                    <button
                    title="Share"
                    className="flex items-center hover:text-blue-500 transition"
                    >
                        <ShareIcon size={22} color="#262626" />
                    </button>
                    {createdAt && <span className="leading-none">{new Date(createdAt).toLocaleDateString("vi-VN")}</span>}
                    {location && <span className="leading-none">{location}</span>}
                </div>
            </div>
        </div>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            border: 'none',
            background: '#f0f0f0',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            transition: 'background 0.3s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#e0e0e0')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#f0f0f0')}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
