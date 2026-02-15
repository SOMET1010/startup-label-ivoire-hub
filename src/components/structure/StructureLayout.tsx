import { ReactNode } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { StructureSidebar } from "./StructureSidebar";
import { StructureHeader } from "./StructureHeader";

interface StructureLayoutProps {
  children: ReactNode;
}

export function StructureLayout({ children }: StructureLayoutProps) {
  return (
    <DashboardLayout sidebar={<StructureSidebar />} header={<StructureHeader />}>
      {children}
    </DashboardLayout>
  );
}
