import { Link } from 'react-router-dom';
import { 
  Award, FileText, Briefcase, Calendar, Users, RefreshCw, 
  ArrowRight, TrendingUp, Bell, CheckCircle2 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LabelStatusCard } from '@/components/label-space/LabelStatusCard';
import { OpportunityCard } from '@/components/label-space/OpportunityCard';
import { EventCard } from '@/components/label-space/EventCard';
import { useLabelStatus } from '@/hooks/useLabelStatus';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useEvents } from '@/hooks/useEvents';

const quickLinks = [
  { 
    title: 'Ressources', 
    description: 'Guides, templates et formations exclusives', 
    icon: FileText, 
    href: '/startup/ressources',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
  },
  { 
    title: 'Opportunités', 
    description: 'Marchés publics, financements et partenariats', 
    icon: Briefcase, 
    href: '/startup/opportunites',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
  },
  { 
    title: 'Événements', 
    description: 'Networking et formations exclusives', 
    icon: Calendar, 
    href: '/startup/evenements',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
  },
  { 
    title: 'Réseau', 
    description: 'Annuaire des startups labellisées', 
    icon: Users, 
    href: '/startup/reseau',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
  },
  { 
    title: 'Renouvellement', 
    description: 'Gérer le renouvellement de votre label', 
    icon: RefreshCw, 
    href: '/startup/renouvellement',
    color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
  },
];

const benefits = [
  { label: 'Exonérations fiscales', status: 'active' },
  { label: 'Accès marchés publics', status: 'active' },
  { label: 'Programme mentorat', status: 'pending' },
  { label: 'Financement', status: 'inactive' },
];

export default function LabelSpace() {
  const { startup } = useLabelStatus();
  const { opportunities } = useOpportunities();
  const { events } = useEvents();

  const recentOpportunities = opportunities.slice(0, 2);
  const upcomingEvents = events.slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Espace Label</h1>
                <p className="text-muted-foreground">
                  Bienvenue dans votre espace exclusif, {startup?.name || 'Startup'}
                </p>
              </div>
            </div>
          </div>

          {/* Label Status Card */}
          <div className="mb-8">
            <LabelStatusCard />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Links */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Accès rapide</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {quickLinks.map((link) => (
                    <Link key={link.href} to={link.href}>
                      <Card className="hover:shadow-md transition-all hover:border-primary/50 cursor-pointer h-full">
                        <CardContent className="p-4 flex items-start gap-4">
                          <div className={`p-2 rounded-lg ${link.color}`}>
                            <link.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{link.title}</h3>
                            <p className="text-sm text-muted-foreground">{link.description}</p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Recent Opportunities */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Opportunités récentes</h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/startup/opportunites" className="gap-1">
                      Voir tout <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                {recentOpportunities.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {recentOpportunities.map((opp) => (
                      <OpportunityCard key={opp.id} opportunity={opp} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                      Aucune opportunité disponible pour le moment.
                    </CardContent>
                  </Card>
                )}
              </section>

              {/* Upcoming Events */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Événements à venir</h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/startup/evenements" className="gap-1">
                      Voir tout <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                {upcomingEvents.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {upcomingEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                      Aucun événement planifié pour le moment.
                    </CardContent>
                  </Card>
                )}
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Benefits Tracker */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Vos avantages
                  </CardTitle>
                  <CardDescription>
                    Suivi de l'activation de vos avantages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm">{benefit.label}</span>
                        <Badge 
                          variant={
                            benefit.status === 'active' ? 'default' : 
                            benefit.status === 'pending' ? 'secondary' : 'outline'
                          }
                          className="text-xs"
                        >
                          {benefit.status === 'active' ? 'Actif' : 
                           benefit.status === 'pending' ? 'En cours' : 'À activer'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link to="/avantages">Découvrir tous les avantages</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Bell className="h-5 w-5 text-primary" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Nouvelle opportunité</p>
                        <p className="text-xs text-muted-foreground">Marché ARTCI disponible</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                      <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Événement à venir</p>
                        <p className="text-xs text-muted-foreground">Networking le 15 février</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Help */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Besoin d'aide ?</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Notre équipe est à votre disposition pour vous accompagner.
                  </p>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/contact">Nous contacter</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
