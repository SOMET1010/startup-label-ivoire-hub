
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Criteres from "./pages/Criteres";
import Avantages from "./pages/Avantages";
import Postuler from "./pages/Postuler";
import Annuaire from "./pages/Annuaire";
import Accompagnement from "./pages/Accompagnement";
import Investisseurs from "./pages/Investisseurs";
import Inscription from "./pages/Inscription";
import Connexion from "./pages/Connexion";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/criteres" element={<Criteres />} />
          <Route path="/avantages" element={<Avantages />} />
          <Route path="/postuler" element={<Postuler />} />
          <Route path="/annuaire" element={<Annuaire />} />
          <Route path="/accompagnement" element={<Accompagnement />} />
          <Route path="/investisseurs" element={<Investisseurs />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/connexion" element={<Connexion />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
