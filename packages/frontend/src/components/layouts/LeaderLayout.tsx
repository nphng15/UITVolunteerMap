import { Outlet } from "react-router";
import BackgroundLayout from "./BackgroundLayout";
import Footer from "@/components/layouts/Footer";

export default function LeaderLayout() {
  return (
    <>
      <BackgroundLayout>
        <Outlet />
      </BackgroundLayout>

    </>
  );
}
