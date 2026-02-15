import { ReactNode } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { InvestorSidebar } from "./InvestorSidebar";
import { InvestorHeader } from "./InvestorHeader";

interface InvestorLayoutProps {
  children: ReactNode;
}

export function InvestorLayout({ children }: InvestorLayoutProps) {
  return (
    <DashboardLayout sidebar={<InvestorSidebar />} header={<InvestorHeader />}>
      {children}
    </DashboardLayout>
  );
}
