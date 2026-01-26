import { createBrowserRouter, Navigate } from "react-router";
import RootLayout from "@/layouts/RootLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import HomePage from "@/routes/HomePage";
import LoginPage from "@/routes/LoginPage";
import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboard from "@/routes/admin/AdminDashboard";
import NotFoundPage from "@/routes/NotFoundPage";
import { RoleEnum } from "@uit-volunteer-map/shared";
import LeaderLayout from "@/layouts/LeaderLayout";
import CampaignPage from "@/routes/CampaignPage";
import TeamPage from "@/routes/TeamPage";
import PostModal from "@/routes/PostModal";
import MyTeamPage from "@/routes/leader/MyTeamPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      {
        path: "campaign/:campaignId",
        children: [
          { index: true, element: <CampaignPage /> },
          {
            path: "team/:teamId",
            children: [
              { index: true, element: <TeamPage /> },
              {
                path: "post/:postId",
                element: <PostModal />,
              },
            ],
          },
        ],
      },
      {
        path: "admin",
        element: <ProtectedRoute requiredRoles={[RoleEnum.ADMIN]} />,
        children: [
          {
            element: <AdminLayout />,
            children: [{ path: "dashboard", element: <AdminDashboard /> }],
          },
        ],
      },
      {
        path: "leader",
        element: <ProtectedRoute requiredRoles={[RoleEnum.LEADER]} />,
        children: [
          {
            element: <LeaderLayout />,
            children: [{ index: true, element: <MyTeamPage /> }],
          },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
