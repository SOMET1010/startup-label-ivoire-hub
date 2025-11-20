
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { RoleGate } from "./components/auth/RoleGate";

// Components
import CloudStatusBanner from "./components/CloudStatusBanner";

// Public pages
import Index from "./pages/Index";
import Criteres from "./pages/Criteres";
import Avantages from "./pages/Avantages";
import Postuler from "./pages/Postuler";
import Annuaire from "./pages/Annuaire";
import Accompagnement from "./pages/Accompagnement";
import Investisseurs from "./pages/Investisseurs";
import EntreprisesIA from "./pages/EntreprisesIA";
import EntrepriseIADetail from "./pages/EntrepriseIADetail";
import Inscription from "./pages/Inscription";
import Connexion from "./pages/Connexion";
import NotFound from "./pages/NotFound";
import SuiviCandidature from "./pages/SuiviCandidature";
import FAQ from "./pages/FAQ";
import Actualites from "./pages/Actualites";

// Startup pages
import StartupDashboard from "./pages/startup/Dashboard";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CloudStatusBanner />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/criteres" element={<Criteres />} />
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
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/connexion" element={<Connexion />} />
          
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
