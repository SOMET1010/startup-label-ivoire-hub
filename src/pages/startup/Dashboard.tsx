import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, TrendingUp, User, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StartupDashboard() {
  const { profile } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Bienvenue, {profile?.full_name || 'Startup'} !
        </h1>
        <p className="text-muted-foreground">
          Gérez votre candidature au label et suivez votre progression.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Ma Candidature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Soumettez votre dossier de candidature au label.
            </p>
            <Link to="/startup/candidature">
              <Button className="w-full">Gérer ma candidature</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Suivi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Suivez l'état d'avancement de votre candidature.
            </p>
            <Link to="/startup/suivi">
              <Button variant="outline" className="w-full">
                Voir le suivi
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Mon Profil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Mettez à jour vos informations personnelles.
            </p>
            <Link to="/startup/profil">
              <Button variant="outline" className="w-full">
                Modifier le profil
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aucune notification pour le moment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
