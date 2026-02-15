import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleGate } from "@/components/auth/RoleGate";
import { StructureLayout } from "@/components/structure/StructureLayout";

const StructureDashboard = lazy(() => import("@/pages/structure/Dashboard"));
const StructureStartups = lazy(() => import("@/pages/structure/Startups"));
const StructurePrograms = lazy(() => import("@/pages/structure/Programs"));
const StructureProfile = lazy(() => import("@/pages/structure/Profile"));
const StructureSettings = lazy(() => import("@/pages/structure/Settings"));

export default function StructureRoutes() {
  return (
    <ProtectedRoute>
      <RoleGate allowedRoles={['structure']}>
        <StructureLayout>
          <Routes>
            <Route index element={<StructureDashboard />} />
            <Route path="startups" element={<StructureStartups />} />
            <Route path="programmes" element={<StructurePrograms />} />
            <Route path="profil" element={<StructureProfile />} />
            <Route path="settings" element={<StructureSettings />} />
          </Routes>
        </StructureLayout>
      </RoleGate>
    </ProtectedRoute>
  );
}
