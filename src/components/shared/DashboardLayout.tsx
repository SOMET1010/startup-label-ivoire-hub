import { ReactNode, Suspense } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import PageLoader from "@/components/PageLoader";

interface DashboardLayoutProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

export function DashboardLayout({ sidebar, header, children }: DashboardLayoutProps) {
  return (
    <AuthProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full bg-muted/30">
          {sidebar}
          <SidebarInset className="flex flex-col flex-1">
            {header}
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
