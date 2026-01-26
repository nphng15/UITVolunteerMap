import { useNavigate, useParams } from "react-router";

export default function ModalPage() {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-semibold mb-4 text-black">Thông tin bài post {postId}</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-700 text-white rounded"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
