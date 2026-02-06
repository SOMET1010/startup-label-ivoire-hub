import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageBreadcrumb } from "@/components/shared/PageBreadcrumb";
import { SEOHead } from "@/components/shared/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, ExternalLink, FileText, Scale, BookOpen, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

interface LegalDocument {
  id: string;
  title: string;
  description: string | null;
  document_type: string;
  official_number: string | null;
  file_url: string | null;
  external_url: string | null;
  published_date: string | null;
  display_order: number;
}

const typeIcons: Record<string, typeof Scale> = {
  law: Scale,
  decree: BookOpen,
  order: FileText,
  circular: FileText,
};

const typeLabels: Record<string, { fr: string; en: string }> = {
  law: { fr: "Loi", en: "Law" },
  decree: { fr: "Décret", en: "Decree" },
  order: { fr: "Arrêté", en: "Order" },
  circular: { fr: "Circulaire", en: "Circular" },
};

const CadreJuridique = () => {
  const { t, i18n } = useTranslation("pages");
  const lang = i18n.language === "en" ? "en" : "fr";

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["legal-documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("legal_documents")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as LegalDocument[];
    },
  });

  const laws = documents.filter((d) => d.document_type === "law");
  const decrees = documents.filter((d) => d.document_type === "decree");
  const others = documents.filter((d) => !["law", "decree"].includes(d.document_type));

  const formatDate = (date: string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const DocumentCard = ({ doc }: { doc: LegalDocument }) => {
    const Icon = typeIcons[doc.document_type] || FileText;
    const hasFile = doc.file_url || doc.external_url;

    return (
      <Card className="group hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  {typeLabels[doc.document_type]?.[lang] || doc.document_type}
                </Badge>
                {doc.official_number && (
                  <Badge variant="outline" className="text-xs">
                    N° {doc.official_number}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-base leading-snug">{doc.title}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {doc.description && (
            <p className="text-sm text-muted-foreground mb-4">{doc.description}</p>
          )}
          <div className="flex items-center justify-between flex-wrap gap-2">
            {doc.published_date ? (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {lang === "fr" ? "Publié le" : "Published on"} {formatDate(doc.published_date)}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-destructive">
                <Clock className="h-3.5 w-3.5" />
                <span>{lang === "fr" ? "À paraître" : "Coming soon"}</span>
              </div>
            )}
            {hasFile && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="gap-1.5"
              >
                <a
                  href={doc.file_url || doc.external_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {doc.file_url ? (
                    <>
                      <Download className="h-3.5 w-3.5" />
                      {lang === "fr" ? "Télécharger" : "Download"}
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-3.5 w-3.5" />
                      {lang === "fr" ? "Consulter" : "View"}
                    </>
                  )}
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const SectionSkeleton = () => (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={lang === "fr" ? "Cadre juridique" : "Legal Framework"}
        description={
          lang === "fr"
            ? "Consultez les textes juridiques encadrant la labellisation des startups numériques en Côte d'Ivoire : loi, décrets d'application, arrêtés."
            : "Consult the legal texts governing the labeling of digital startups in Côte d'Ivoire: law, application decrees, orders."
        }
        path="/cadre-juridique"
      />
      <Navbar />
      <PageBreadcrumb
        currentLabel={lang === "fr" ? "Cadre juridique" : "Legal Framework"}
        className="py-3 bg-muted/30 border-b border-border"
      />
      <main id="main-content" className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Scale className="h-4 w-4" />
              {lang === "fr" ? "Loi n°2023-901" : "Law No. 2023-901"}
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              {lang === "fr" ? "Cadre juridique" : "Legal Framework"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {lang === "fr"
                ? "La labellisation des startups numériques en Côte d'Ivoire est encadrée par la Loi n°2023-901 du 23 novembre 2023. Retrouvez ici l'ensemble des textes juridiques applicables."
                : "The labeling of digital startups in Côte d'Ivoire is governed by Law No. 2023-901 of November 23, 2023. Find all applicable legal texts here."}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-4xl space-y-12">
          {/* Section 1: La Loi */}
          <section>
            <h2 className="text-2xl font-heading font-bold mb-2 flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary" />
              {lang === "fr" ? "La Loi" : "The Law"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {lang === "fr"
                ? "Le texte fondateur du dispositif de labellisation des startups numériques."
                : "The foundational text of the digital startup labeling system."}
            </p>
            {isLoading ? (
              <SectionSkeleton />
            ) : laws.length > 0 ? (
              <div className="space-y-4">
                {laws.map((doc) => (
                  <DocumentCard key={doc.id} doc={doc} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                {lang === "fr" ? "Aucun texte disponible." : "No text available."}
              </p>
            )}
          </section>

          {/* Section 2: Décrets d'application */}
          <section>
            <h2 className="text-2xl font-heading font-bold mb-2 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              {lang === "fr" ? "Décrets d'application" : "Application Decrees"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {lang === "fr"
                ? "Les décrets fixant les modalités pratiques de mise en œuvre de la loi."
                : "The decrees setting the practical terms of implementation of the law."}
            </p>
            {isLoading ? (
              <SectionSkeleton />
            ) : decrees.length > 0 ? (
              <div className="space-y-4">
                {decrees.map((doc) => (
                  <DocumentCard key={doc.id} doc={doc} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                {lang === "fr" ? "Aucun décret publié." : "No decrees published."}
              </p>
            )}
          </section>

          {/* Section 3: Textes complémentaires */}
          {others.length > 0 && (
            <section>
              <h2 className="text-2xl font-heading font-bold mb-2 flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                {lang === "fr" ? "Textes complémentaires" : "Supplementary Texts"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {lang === "fr"
                  ? "Arrêtés ministériels, circulaires et autres textes réglementaires."
                  : "Ministerial orders, circulars and other regulatory texts."}
              </p>
              <div className="space-y-4">
                {others.map((doc) => (
                  <DocumentCard key={doc.id} doc={doc} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CadreJuridique;
