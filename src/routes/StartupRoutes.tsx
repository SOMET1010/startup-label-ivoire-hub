import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleGate } from "@/components/auth/RoleGate";
import { LabelGate } from "@/components/auth/LabelGate";
import { StartupLayout } from "@/components/startup/StartupLayout";

const StartupDashboard = lazy(() => import("@/pages/startup/Dashboard"));
const StartupDossier = lazy(() => import("@/pages/startup/Dossier"));
const StartupMessages = lazy(() => import("@/pages/startup/Messages"));
const StartupSupport = lazy(() => import("@/pages/startup/Support"));
const LabelSpace = lazy(() => import("@/pages/startup/LabelSpace"));
const Resources = lazy(() => import("@/pages/startup/Resources"));
const Opportunities = lazy(() => import("@/pages/startup/Opportunities"));
const Events = lazy(() => import("@/pages/startup/Events"));
const Network = lazy(() => import("@/pages/startup/Network"));
const Renewal = lazy(() => import("@/pages/startup/Renewal"));
const StartupProfile = lazy(() => import("@/pages/startup/Profile"));
const StartupSettings = lazy(() => import("@/pages/startup/Settings"));

export default function StartupRoutes() {
  return (
    <ProtectedRoute>
      <RoleGate allowedRoles={['startup']}>
        <StartupLayout>
          <Routes>
            <Route index element={<StartupDashboard />} />
            <Route path="dossier" element={<StartupDossier />} />
            <Route path="messages" element={<StartupMessages />} />
            <Route path="opportunites" element={
              <LabelGate><Opportunities /></LabelGate>
            } />
            <Route path="reseau" element={
              <LabelGate><Network /></LabelGate>
            } />
            <Route path="ressources" element={
              <LabelGate><Resources /></LabelGate>
            } />
            <Route path="support" element={<StartupSupport />} />
            <Route path="profile" element={<StartupProfile />} />
            <Route path="label-space" element={
              <LabelGate><LabelSpace /></LabelGate>
            } />
            <Route path="events" element={
              <LabelGate><Events /></LabelGate>
            } />
            <Route path="renewal" element={
              <LabelGate><Renewal /></LabelGate>
            } />
            <Route path="settings" element={<StartupSettings />} />
          </Routes>
        </StartupLayout>
      </RoleGate>
    </ProtectedRoute>
  );
}
