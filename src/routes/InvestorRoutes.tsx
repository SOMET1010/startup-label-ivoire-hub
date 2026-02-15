import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleGate } from "@/components/auth/RoleGate";
import { InvestorLayout } from "@/components/investor/InvestorLayout";

const InvestorDashboard = lazy(() => import("@/pages/investor/Dashboard"));
const InvestorStartups = lazy(() => import("@/pages/investor/Startups"));
const InvestorInterests = lazy(() => import("@/pages/investor/Interests"));
const InvestorMessages = lazy(() => import("@/pages/investor/Messages"));
const InvestorProfile = lazy(() => import("@/pages/investor/Profile"));
const InvestorSettings = lazy(() => import("@/pages/investor/Settings"));

export default function InvestorRoutes() {
  return (
    <ProtectedRoute>
      <RoleGate allowedRoles={['investor']}>
        <InvestorLayout>
          <Routes>
            <Route index element={<InvestorDashboard />} />
            <Route path="startups" element={<InvestorStartups />} />
            <Route path="interests" element={<InvestorInterests />} />
            <Route path="messages" element={<InvestorMessages />} />
            <Route path="profil" element={<InvestorProfile />} />
            <Route path="settings" element={<InvestorSettings />} />
          </Routes>
        </InvestorLayout>
      </RoleGate>
    </ProtectedRoute>
  );
}
