import { ReactNode, Suspense } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { StartupSidebar } from "./StartupSidebar";
import { StartupHeader } from "./StartupHeader";
import { AuthProvider } from "@/contexts/AuthContext";
import PageLoader from "@/components/PageLoader";

interface StartupLayoutProps {
  children: ReactNode;
}

export function StartupLayout({ children }: StartupLayoutProps) {
  return (
    <AuthProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full bg-muted/30">
          <StartupSidebar />
          <SidebarInset className="flex flex-col flex-1">
            <StartupHeader />
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
