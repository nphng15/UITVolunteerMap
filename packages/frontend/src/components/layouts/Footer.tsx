import uitLogo from "@/assets/icons/uitvolunteer.svg";
import mailIcon from "@/assets/icons/footer_mail-icon.svg";
import fbIcon from "@/assets/icons/footer_Facebook-icon.svg";
import locationIcon from "@/assets/icons/footer_Location-icons.svg";
import creditIcon from "@/assets/icons/Credits.svg";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center gap-4 mb-4">
          <img src={uitLogo} alt="UITVolunteer" className="h-8" />
          <span className="font-semibold text-sm">Trang chủ</span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm text-white/90 mb-4">
          <span className="font-semibold">Liên hệ:</span>

          <div className="flex items-center gap-2">
            <img src={mailIcon} className="w-4 h-4" />
            <span>hsvdhcntt@hoisinhvientphcm.com</span>
          </div>

          <div className="flex items-center gap-2">
            <img src={fbIcon} className="w-4 h-4" />
            <span>facebook.com/tuoitre.uit</span>
          </div>

          <div className="flex items-center gap-2">
            <img src={locationIcon} className="w-4 h-4" />
            <span>Khu phố 34, Phường Linh Xuân, TP.HCM</span>
          </div>
        </div>

        <div className="border-t border-white/30 mb-4" />
        <div className="flex items-center justify-between">
          <div className="text-xs text-white/60">
            UITVolunteer © 2026. All rights reserved.
          </div>

          <img
            src={creditIcon}
            alt="Credits"
            className="w-10 h-10"
          />
        </div>
      </div>
    </footer>
  );
}
