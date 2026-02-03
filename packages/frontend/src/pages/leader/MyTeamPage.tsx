import { useParams, Link, useLocation } from "react-router";
import editIcon from "@/assets/icons/edit.svg";
import { useState } from "react";
import FormationEditOverall from "@/components/ui/popups/FormationEditOverall";
import FormationEditRole from "@/components/ui/popups/FormationEditRole";
import PostCreatePopup from "@/components/ui/popups/post/PostCreatePopup";
import PostCreateChooseEditPopup from "@/components/ui/popups/post/PostCreateChooseEditPopup";
import PostCreatePublishEditPopup from "@/components/ui/popups/post/PostCreatePublishEditPopup";



export default function MyTeamPage() {
    const { teamId } = useParams<{ teamId: string }>();
    const location = useLocation();

    const [showOverall, setShowOverall] = useState(false);
    const [showRole, setShowRole] = useState(false);

    const [postStep, setPostStep] = useState<0 | 1 | 2 | null>(null);

    const commanders = Array.from({ length: 3 });
    const activities = Array.from({ length: 8 });

  return (
    <>
      {/* ===== POPUPS ===== */}
      {showOverall && (
        <FormationEditOverall onClose={() => setShowOverall(false)} />
      )}

      {showRole && (
        <FormationEditRole onClose={() => setShowRole(false)} />
      )}

    {/* ===== POST CREATE POPUPS ===== */}
    {postStep === 0 && (
    <PostCreatePopup
        onNext={() => setPostStep(1)}
        onClose={() => setPostStep(null)}
    />
    )}

    {postStep === 1 && (
    <PostCreateChooseEditPopup
        onBack={() => setPostStep(0)}
        onNext={() => setPostStep(2)}
    />
    )}

    {postStep === 2 && (
    <PostCreatePublishEditPopup
        onBack={() => setPostStep(1)}
        onSubmit={() => setPostStep(null)}
    />
    )}

      {/* ===== PAGE ===== */}
      <div className="pt-8 pb-4">

        {/* ===== HEADER ===== */}
        <section className="max-w-4xl mx-auto px-4 mb-8">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-black">
              Tên đội hình {teamId}
            </h1>
          </div>
        </section>


        {/* ===== IMAGES GALLERY ===== */}
        <section className="max-w-5xl mx-auto px-4 mb-12 flex flex-col items-center">

          <div className="relative flex items-end justify-center">

            {/* MAIN IMAGE */}
            <div className="relative z-20 w-[440px] h-[280px] rounded-2xl overflow-hidden shadow-lg bg-white flex items-center justify-center">
              <span className="text-gray-400 text-sm">Ảnh chính</span>
            </div>

            {/* LEFT IMAGE */}
            <div className="
              absolute left-[-160px] bottom-[50px]
              z-10 w-[260px] h-[180px]
              rounded-xl overflow-hidden shadow-md bg-white
              flex items-center justify-center
            ">
              <span className="text-gray-400 text-sm">Ảnh phụ</span>
            </div>

            {/* RIGHT IMAGE */}
            <div className="
              absolute right-[-160px] bottom-[50px]
              z-10 w-[260px] h-[180px]
              rounded-xl overflow-hidden shadow-md bg-white
              flex items-center justify-center
            ">
              <span className="text-gray-400 text-sm">Ảnh phụ</span>
            </div>

          </div>

          {/* EDIT BUTTON */}
          <div className="w-full max-w-[960px] flex justify-end mr-1">
            <button
              onClick={() => setShowOverall(true)}
              className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:scale-110 transition mr-20"
            >
              <img src={editIcon} className="w-7 h-7 opacity-70" />
            </button>
          </div>

        </section>

        {/* ===== DESCRIPTION ===== */}
        <section className="max-w-3xl mx-auto px-4 text-center mb-12">
          <p className="text-sm font-bold leading-relaxed text-black">
            Mô tả đội hình
          </p>
        </section>

        {/* ===== COMMANDERS ===== */}
        <section className="max-w-4xl mx-auto px-4 mb-14 relative">
          <h2 className="text-center font-black mb-6">Ban chỉ huy</h2>

          <button
            onClick={() => setShowRole(true)}
            className="absolute flex gap-1 right-4 top-0 text-xs underline"
          >
            <img src={editIcon} className="w-4 h-4" />
            Edit chỉ huy
          </button>

          <div className="grid grid-cols-3 gap-8">
            {commanders.map((_, i) => (
              <div key={i} className="text-center">
                <div
                  onClick={() => setShowRole(true)}
                  className="cursor-pointer w-24 h-24 mx-auto rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center mb-4"
                >
                  <div className="w-8 h-8 rounded-full bg-white/60" />
                </div>
                <div className="text-xs font-black">Chức vụ</div>
                <div className="text-xs font-bold text-gray-700">
                  Họ và tên
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== POSTS ===== */}
        <section className="max-w-4xl mx-auto px-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-black">Hoạt động</h2>

            <button
              onClick={() => setPostStep(0)}
              className="text-xs font-bold underline"
            >
              + Tạo bài đăng
            </button>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {activities.map((_, i) => (
              <div key={i} className="relative group">
                <Link
                  to={`post/${i + 1}`}
                  state={{ backgroundLocation: location }}
                  className="bg-white/80 backdrop-blur-sm aspect-square flex items-center justify-center rounded-md hover:scale-105 transition"
                >
                  <div className="w-12 h-12 border-2 border-white rotate-45" />
                </Link>

                <Link
                  to={`post/${i + 1}`}
                  state={{ backgroundLocation: location }}
                  className="absolute top-1 right-1 text-[10px] bg-white px-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
    
  );
}
