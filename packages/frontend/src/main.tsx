import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import QueryProvider from "@/contexts/QueryProvider";
import AuthProvider from "@/contexts/AuthProvider";
import CampaignProvider from "@/contexts/CampaignProvider";
import { router } from "@/routes";
import "leaflet/dist/leaflet.css";
import "./index.css";
import "./styles/leaflet-labels.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <AuthProvider>
        <CampaignProvider>
          <RouterProvider router={router} />
        </CampaignProvider>
      </AuthProvider>
    </QueryProvider>
  </StrictMode>,
);
