import uitLogo from "@/assets/icons/uitvolunteer.svg";
import mailIcon from "@/assets/icons/footer_mail-icon.svg";
import fbIcon from "@/assets/icons/footer_Facebook-icon.svg";
import locationIcon from "@/assets/icons/footer_Location-icons.svg";
import creditIcon from "@/assets/icons/Credits.svg";
import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-start gap-10">
          <Link to="/">
            <img src={uitLogo} alt="UITVolunteer" className="h-12 w-auto" />
          </Link>
          <div className="flex flex-col gap-3 flex-1">
            <Link to="/" className="font-semibold text-sm">
              Trang chủ
            </Link>
            <div className="flex flex-row items-center gap-6 text-sm text-white/90">
              <span className="font-semibold inline-block whitespace-nowrap">
                Liên hệ:
              </span>

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
          </div>
        </div>

        <div className="border-t border-white/30 my-5" />
        <div className="flex items-center justify-between">
          <div className="text-xs text-white/60">
            UITVolunteer © 2026. All rights reserved.
          </div>

          <img src={creditIcon} alt="Credits" className="w-24 h-24" />
        </div>
      </div>
    </footer>
  );
}
