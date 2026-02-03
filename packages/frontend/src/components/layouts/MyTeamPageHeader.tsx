import logo from "@/assets/Logo_XTN.svg"; // đổi lại đúng đường dẫn logo của bạn

export default function MyTeamPageHeader() {
  return (
    <header className="w-full bg-[#F2A900] shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* LEFT: LOGO */}
        <div className="flex items-center gap-1">
          <img src={logo} alt="Logo" className="h-12" />
        </div>


      </div>
    </header>
  );
}
