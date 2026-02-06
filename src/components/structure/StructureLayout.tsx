import { ReactNode, Suspense } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { StructureSidebar } from "./StructureSidebar";
import { StructureHeader } from "./StructureHeader";
import { AuthProvider } from "@/contexts/AuthContext";
import PageLoader from "@/components/PageLoader";

interface StructureLayoutProps {
  children: ReactNode;
}

export function StructureLayout({ children }: StructureLayoutProps) {
  return (
    <AuthProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full bg-muted/30">
          <StructureSidebar />
          <SidebarInset className="flex flex-col flex-1">
            <StructureHeader />
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
