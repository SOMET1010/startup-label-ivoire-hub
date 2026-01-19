import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { RoleGate } from "./components/auth/RoleGate";
import { LabelGate } from "./components/auth/LabelGate";
import CloudStatusBanner from "./components/CloudStatusBanner";
import LabelCoach from "./components/LabelCoach";
import PageLoader from "./components/PageLoader";
import ErrorBoundary from "./components/ErrorBoundary";

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

// Pages admin - lazy loading
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AuditLogs = lazy(() => import("./pages/admin/AuditLogs"));

// Pages startup - lazy loading
const StartupDashboard = lazy(() => import("./pages/startup/Dashboard"));
const LabelSpace = lazy(() => import("./pages/startup/LabelSpace"));
const Resources = lazy(() => import("./pages/startup/Resources"));
const Opportunities = lazy(() => import("./pages/startup/Opportunities"));
const Events = lazy(() => import("./pages/startup/Events"));
const Network = lazy(() => import("./pages/startup/Network"));
const Renewal = lazy(() => import("./pages/startup/Renewal"));
const StartupProfile = lazy(() => import("./pages/startup/Profile"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
            
            {/* Auth routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/connexion" element={<Auth />} />
            <Route path="/inscription" element={<Auth />} />
            <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Startup routes (protected) */}
            <Route 
              path="/startup" 
              element={
                <ProtectedRoute>
                  <RoleGate allowedRoles={['startup']}>
                    <StartupDashboard />
                  </RoleGate>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/startup/profile" 
              element={
                <ProtectedRoute>
                  <RoleGate allowedRoles={['startup']}>
                    <StartupProfile />
                  </RoleGate>
                </ProtectedRoute>
              } 
            />
            <Route path="/suivi-candidature" element={<SuiviCandidature />} />
            
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
