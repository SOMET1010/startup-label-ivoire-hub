import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageBreadcrumb } from "@/components/shared/PageBreadcrumb";
import { SEOHead } from "@/components/shared/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Shield, Scale, UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CommitteeMember {
  id: string;
  full_name: string;
  title: string | null;
  organization: string | null;
  photo_url: string | null;
  role_in_committee: string;
  bio: string | null;
  display_order: number;
}

const roleLabels: Record<string, { fr: string; en: string }> = {
  president: { fr: "Président", en: "President" },
  vice_president: { fr: "Vice-Président", en: "Vice-President" },
  secretary: { fr: "Secrétaire", en: "Secretary" },
  member: { fr: "Membre", en: "Member" },
};

const rolePriority: Record<string, number> = {
  president: 0,
  vice_president: 1,
  secretary: 2,
  member: 3,
};

const Comite = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "fr";

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["committee-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("committee_members")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return (data as CommitteeMember[]).sort(
        (a, b) =>
          (rolePriority[a.role_in_committee] ?? 3) -
          (rolePriority[b.role_in_committee] ?? 3)
      );
    },
  });

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={lang === "fr" ? "Comité de labellisation" : "Labeling Committee"}
        description={
          lang === "fr"
            ? "Découvrez les membres du Comité de labellisation des startups numériques de Côte d'Ivoire, leur rôle et leur mission."
            : "Discover the members of the Digital Startup Labeling Committee of Côte d'Ivoire, their role and mission."
        }
        path="/comite"
      />
      <Navbar />
      <PageBreadcrumb
        currentLabel={lang === "fr" ? "Comité de labellisation" : "Labeling Committee"}
        className="py-3 bg-muted/30 border-b border-border"
      />
      <main id="main-content" className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Users className="h-4 w-4" />
              {lang === "fr" ? "Instance de gouvernance" : "Governance Body"}
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              {lang === "fr" ? "Comité de labellisation" : "Labeling Committee"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {lang === "fr"
                ? "Le Comité de labellisation est l'instance chargée d'évaluer les candidatures et de décider de l'attribution du Label Startup Numérique."
                : "The Labeling Committee is the body responsible for evaluating applications and deciding on the attribution of the Digital Startup Label."}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-5xl space-y-12">
          {/* Présentation du comité */}
          <section>
            <h2 className="text-2xl font-heading font-bold mb-6">
              {lang === "fr" ? "Rôle et mission" : "Role and Mission"}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
                    <Scale className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">
                    {lang === "fr" ? "Évaluation" : "Evaluation"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {lang === "fr"
                      ? "Le comité examine chaque dossier de candidature selon les critères définis par la loi et évalue l'innovation, le modèle économique, l'impact et l'équipe."
                      : "The committee reviews each application according to the criteria defined by law and evaluates innovation, business model, impact and team."}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">
                    {lang === "fr" ? "Délibération" : "Deliberation"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {lang === "fr"
                      ? "Les décisions sont prises de manière collégiale, après délibération et vote des membres. Un quorum minimum est requis pour la validité des décisions."
                      : "Decisions are made collectively, after deliberation and voting by members. A minimum quorum is required for valid decisions."}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">
                    {lang === "fr" ? "Indépendance" : "Independence"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {lang === "fr"
                      ? "Le comité agit en toute indépendance et impartialité. Ses membres sont tenus à un devoir de confidentialité et de non-conflit d'intérêts."
                      : "The committee acts with full independence and impartiality. Its members are bound by duties of confidentiality and conflict-of-interest avoidance."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Membres du comité */}
          <section>
            <h2 className="text-2xl font-heading font-bold mb-6">
              {lang === "fr" ? "Membres du comité" : "Committee Members"}
            </h2>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i}>
                    <CardContent className="pt-6 text-center">
                      <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
                      <Skeleton className="h-5 w-32 mx-auto mb-2" />
                      <Skeleton className="h-4 w-24 mx-auto" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : members.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member) => (
                  <Card key={member.id} className="group hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6 text-center">
                      <Avatar className="h-20 w-20 mx-auto mb-4">
                        {member.photo_url ? (
                          <AvatarImage
                            src={member.photo_url}
                            alt={member.full_name}
                          />
                        ) : null}
                        <AvatarFallback className="text-lg bg-primary/10 text-primary">
                          {getInitials(member.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <Badge
                        variant={
                          member.role_in_committee === "president"
                            ? "default"
                            : "secondary"
                        }
                        className="mb-2"
                      >
                        {roleLabels[member.role_in_committee]?.[lang] ||
                          member.role_in_committee}
                      </Badge>
                      <h3 className="font-semibold text-lg">{member.full_name}</h3>
                      {member.title && (
                        <p className="text-sm text-muted-foreground">{member.title}</p>
                      )}
                      {member.organization && (
                        <p className="text-sm text-primary/80 font-medium mt-1">
                          {member.organization}
                        </p>
                      )}
                      {member.bio && (
                        <p className="text-xs text-muted-foreground mt-3 line-clamp-3">
                          {member.bio}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {lang === "fr"
                      ? "La composition du comité sera publiée prochainement."
                      : "The committee composition will be published soon."}
                  </p>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Comite;
