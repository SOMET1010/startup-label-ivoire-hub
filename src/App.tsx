import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { RoleGate } from "./components/auth/RoleGate";
import { LabelGate } from "./components/auth/LabelGate";
import CloudStatusBanner from "./components/CloudStatusBanner";
import LabelCoach from "./components/LabelCoach";
import PageLoader from "./components/PageLoader";
import { SkipLink } from "./components/shared/SkipLink";
import ErrorBoundary from "./components/ErrorBoundary";
import { useLanguageSync } from "./hooks/useLanguageSync";
// Pages critiques - import statique pour chargement instantané
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Pages auth - lazy loading
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

// Pages publiques - lazy loading
const Criteres = lazy(() => import("./pages/Criteres"));
const Avantages = lazy(() => import("./pages/Avantages"));
const EligibiliteQuiz = lazy(() => import("./pages/EligibiliteQuiz"));
const Postuler = lazy(() => import("./pages/Postuler"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Actualites = lazy(() => import("./pages/Actualites"));
const ActualiteDetail = lazy(() => import("./pages/ActualiteDetail"));
const Accompagnement = lazy(() => import("./pages/Accompagnement"));
const Investisseurs = lazy(() => import("./pages/Investisseurs"));
const EntreprisesIA = lazy(() => import("./pages/EntreprisesIA"));
const EntrepriseIADetail = lazy(() => import("./pages/EntrepriseIADetail"));
const Annuaire = lazy(() => import("./pages/Annuaire"));
const SuiviCandidature = lazy(() => import("./pages/SuiviCandidature"));

// Pages légales - lazy loading
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const Confidentialite = lazy(() => import("./pages/Confidentialite"));
const CGU = lazy(() => import("./pages/CGU"));
const CadreJuridique = lazy(() => import("./pages/CadreJuridique"));
const Comite = lazy(() => import("./pages/Comite"));

// Pages admin - lazy loading
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AuditLogs = lazy(() => import("./pages/admin/AuditLogs"));

// Role-specific route modules - lazy loading
const StartupRoutes = lazy(() => import("./routes/StartupRoutes"));
const StructureRoutes = lazy(() => import("./routes/StructureRoutes"));
const InvestorRoutes = lazy(() => import("./routes/InvestorRoutes"));


const queryClient = new QueryClient();


// Inner component that can use hooks requiring AuthProvider
const AppContent = () => {
  // Synchronize i18n language with user profile preference
  useLanguageSync();

  return (
    <>
      <SkipLink />
      <CloudStatusBanner />
      <LabelCoach />
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/criteres" element={<Criteres />} />
            <Route path="/eligibilite" element={<EligibiliteQuiz />} />
            <Route path="/avantages" element={<Avantages />} />
            <Route path="/postuler" element={<Postuler />} />
            <Route path="/annuaire" element={<Annuaire />} />
            <Route path="/accompagnement" element={<Accompagnement />} />
            <Route path="/investisseurs" element={<Investisseurs />} />
            <Route path="/entreprises-ia" element={<EntreprisesIA />} />
            <Route path="/entreprises-ia/:id" element={<EntrepriseIADetail />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/actualites" element={<Actualites />} />
            <Route path="/actualites/:id" element={<ActualiteDetail />} />
            
            {/* Legal pages */}
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/confidentialite" element={<Confidentialite />} />
            <Route path="/cgu" element={<CGU />} />
            <Route path="/cadre-juridique" element={<CadreJuridique />} />
            <Route path="/comite" element={<Comite />} />
            
            {/* Auth routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/connexion" element={<Auth />} />
            <Route path="/inscription" element={<Auth />} />
            <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Startup routes with dedicated layout */}
            <Route path="/startup/*" element={<StartupRoutes />} />
            
            {/* Structure routes with dedicated layout */}
            <Route path="/structure/*" element={<StructureRoutes />} />
            
            {/* Investor routes with dedicated layout */}
            <Route path="/investor/*" element={<InvestorRoutes />} />
            
            <Route path="/suivi-candidature" element={
              <ProtectedRoute>
                <RoleGate allowedRoles={['startup', 'admin']}>
                  <SuiviCandidature />
                </RoleGate>
              </ProtectedRoute>
            } />
            
            {/* Admin routes (protected) */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <RoleGate allowedRoles={['admin', 'evaluator']}>
                    <AdminDashboard />
                  </RoleGate>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/audit-logs" 
              element={
                <ProtectedRoute>
                  <RoleGate allowedRoles={['admin']}>
                    <AuditLogs />
                  </RoleGate>
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
