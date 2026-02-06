interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LogoutConfirmPopup({ onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-[#FFF6E5] rounded-xl shadow-lg w-[380px] overflow-hidden">
        
        {/* Nội dung */}
        <div className="p-6 text-center font-semibold">
          Bạn có chắc muốn đăng xuất không?
        </div>

        {/* Footer */}
        <div className="flex border-t">
          <button
            onClick={onConfirm}
            className="w-1/2 py-3 bg-[#F2A900] font-semibold"
          >
            Có
          </button>

          <button
            onClick={onCancel}
            className="w-1/2 py-3 bg-white font-semibold"
          >
            Không
          </button>
        </div>
      </div>
    </div>
  );
}
