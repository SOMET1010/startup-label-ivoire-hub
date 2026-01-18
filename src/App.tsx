
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
import Index from "./pages/Index";
import Criteres from "./pages/Criteres";
import Avantages from "./pages/Avantages";
import EligibiliteQuiz from "./pages/EligibiliteQuiz";
import Postuler from "./pages/Postuler";
import FAQ from "./pages/FAQ";
import Actualites from "./pages/Actualites";
import ActualiteDetail from "./pages/ActualiteDetail";
import Accompagnement from "./pages/Accompagnement";
import Investisseurs from "./pages/Investisseurs";
import EntreprisesIA from "./pages/EntreprisesIA";
import EntrepriseIADetail from "./pages/EntrepriseIADetail";
import Annuaire from "./pages/Annuaire";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import SuiviCandidature from "./pages/SuiviCandidature";
import AdminDashboard from "./pages/admin/Dashboard";
import StartupDashboard from "./pages/startup/Dashboard";
import LabelSpace from "./pages/startup/LabelSpace";
import Resources from "./pages/startup/Resources";
import Opportunities from "./pages/startup/Opportunities";
import Events from "./pages/startup/Events";
import Network from "./pages/startup/Network";
import Renewal from "./pages/startup/Renewal";
import StartupProfile from "./pages/startup/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CloudStatusBanner />
        <LabelCoach />
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
          
          {/* Auth route */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/connexion" element={<Auth />} />
          <Route path="/inscription" element={<Auth />} />
          
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
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
