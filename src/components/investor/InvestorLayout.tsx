import { ReactNode, Suspense } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { InvestorSidebar } from "./InvestorSidebar";
import { InvestorHeader } from "./InvestorHeader";
import { AuthProvider } from "@/contexts/AuthContext";
import PageLoader from "@/components/PageLoader";

interface InvestorLayoutProps {
  children: ReactNode;
}

export function InvestorLayout({ children }: InvestorLayoutProps) {
  return (
    <AuthProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full bg-muted/30">
          <InvestorSidebar />
          <SidebarInset className="flex flex-col flex-1">
            <InvestorHeader />
            <main className="flex-1 p-4 lg:p-6 overflow-auto">
              <Suspense fallback={<PageLoader />}>
                {children}
              </Suspense>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}
