import { ReactNode } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { StartupSidebar } from "./StartupSidebar";
import { StartupHeader } from "./StartupHeader";

interface StartupLayoutProps {
  children: ReactNode;
}

export function StartupLayout({ children }: StartupLayoutProps) {
  return (
    <DashboardLayout sidebar={<StartupSidebar />} header={<StartupHeader />}>
      {children}
    </DashboardLayout>
  );
}
