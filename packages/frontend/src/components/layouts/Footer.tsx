import { Link } from "react-router";

import uitLogo from "@/assets/icons/uitvolunteer.svg";
import mailIcon from "@/assets/icons/footer_mail-icon.svg";
import fbIcon from "@/assets/icons/footer_Facebook-icon.svg";
import locationIcon from "@/assets/icons/footer_Location-icons.svg";
import creditIcon from "@/assets/icons/Credits.svg";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col gap-4">
            <Link to="/">
              <img
                src={uitLogo}
                alt="UITVolunteer"
                className="h-12 w-auto"
              />
            </Link>
            <p
              className="
                text-white
                text-justify
                font-googleSans
                text-[16px]
                font-medium
                leading-[1.5]
                w-[420px]
                max-w-full
                break-words
              "
            >
              UIT Volunteer là một trang web tổng hợp các chiến dịch tình nguyện
              tại Trường Đại học Công Nghệ Thông Tin – ĐHQG TP.HCM. Đây không
              những là nơi các bạn chiến sĩ tình nguyện nhìn lại chặng đường đã
              qua, mà còn là một nguồn lan tỏa nét đẹp tình nguyện UIT với mọi
              người.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-base">Liên kết nhanh</h3>

            <Link
              to="/"
              className="text-sm text-white/80 hover:text-white transition"
            >
              UIT Volunteer
            </Link>

            <Link
              to="/campaign/xuan-tinh-nguyen"
              className="text-sm text-white/80 hover:text-white transition"
            >
              Xuân Tình Nguyện
            </Link>

            <span className="text-sm text-white/80">
              Mùa Hè Xanh
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-base">Liên hệ</h3>

            <div className="flex items-start gap-2 text-sm text-white/80">
              <img
                src={locationIcon}
                alt="Location"
                className="w-4 h-4 mt-0.5"
              />
              <span>Khu phố 34, Phường Linh Xuân, TP.HCM</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-white/80">
              <img
                src={mailIcon}
                alt="Email"
                className="w-4 h-4"
              />
              <span>hsvdhcntt@hoisinhvientphcm.com</span>
            </div>
            <a
              href="https://www.facebook.com/tuoitre.uit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/80 hover:text-white"
            >
              <img src={fbIcon} className="w-4 h-4" />
              <span>facebook.com/tuoitre.uit</span>
            </a>
          </div>
        </div>
        <div className="border-t border-white/20 my-6" />
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/60">
            UITVolunteer © 2026. All rights reserved.
          </span>

          <img
            src={creditIcon}
            alt="Credits"
            className="w-20 h-auto"
          />
        </div>
      </div>
    </footer>
  );
}