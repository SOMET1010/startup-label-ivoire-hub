import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApplicationTracking } from "@/hooks/useApplicationTracking";
import ApplicationsList from "@/components/suivi/ApplicationsList";
import ApplicationDetailPanel from "@/components/suivi/ApplicationDetailPanel";
import { Loader2, Building, RefreshCw } from "lucide-react";

const SuiviCandidature = () => {
  const {
    applications,
    loading,
    selectedApp,
    setSelectedApp,
    fetchApplications,
  } = useApplicationTracking();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Suivi de vos candidatures</h1>
                <p className="text-muted-foreground">
                  Suivez l'état d'avancement de vos demandes de labellisation en temps réel
                </p>
              </div>
              <Button variant="outline" onClick={fetchApplications} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Actualiser
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : applications.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Aucune candidature</h2>
                  <p className="text-muted-foreground mb-6">
                    Vous n'avez pas encore soumis de candidature au Label Startup Numérique.
                  </p>
                  <Button asChild>
                    <Link to="/postuler">Soumettre une candidature</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ApplicationsList
                  applications={applications}
                  selectedApp={selectedApp}
                  onSelect={setSelectedApp}
                />
                <div className="lg:col-span-2 space-y-6">
                  <ApplicationDetailPanel selectedApp={selectedApp} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SuiviCandidature;
