import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageBreadcrumb } from "@/components/shared/PageBreadcrumb";
import { SEOHead } from "@/components/shared/SEOHead";
import { usePlatformSettings } from "@/hooks/usePlatformSettings";

const Confidentialite = () => {
  const { settings } = usePlatformSettings();

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Politique de confidentialité"
        description="Politique de confidentialité d'Ivoire Hub — comment nous protégeons vos données personnelles."
        path="/confidentialite"
        noindex
      />
      <Navbar />
      <PageBreadcrumb currentLabel="Politique de confidentialité" className="py-3 bg-muted/30 border-b border-border" />
      <main id="main-content" className="flex-grow">
        <div className="container mx-auto px-4 py-12 max-w-4xl prose prose-lg dark:prose-invert">
          <h1>Politique de confidentialité</h1>
          <p className="lead">
            Dernière mise à jour : février 2026
          </p>

          <h2>1. Responsable du traitement</h2>
          <p>
            Le responsable du traitement des données collectées sur la plateforme {settings.platform_name} est
            le {settings.ministry_name} de la République de Côte d'Ivoire.
          </p>

          <h2>2. Données collectées</h2>
          <p>Nous collectons les données suivantes :</p>
          <ul>
            <li><strong>Données d'identification :</strong> nom, prénom, adresse email</li>
            <li><strong>Données de la startup :</strong> nom, secteur, description, documents administratifs (RCCM, statuts, etc.)</li>
            <li><strong>Données de navigation :</strong> adresse IP, type de navigateur, pages visitées</li>
            <li><strong>Données de contact :</strong> messages envoyés via les formulaires de contact</li>
          </ul>

          <h2>3. Finalités du traitement</h2>
          <p>Vos données sont collectées pour :</p>
          <ul>
            <li>Gérer le processus de labellisation des startups</li>
            <li>Communiquer avec vous concernant votre candidature</li>
            <li>Vous informer des actualités et opportunités du programme</li>
            <li>Améliorer la qualité de nos services</li>
            <li>Établir des statistiques anonymisées sur l'écosystème startup ivoirien</li>
          </ul>

          <h2>4. Base légale</h2>
          <p>
            Le traitement de vos données repose sur votre consentement (inscription volontaire)
            et sur l'intérêt légitime de l'administration dans le cadre de sa mission de soutien
            à l'innovation numérique.
          </p>

          <h2>5. Durée de conservation</h2>
          <ul>
            <li><strong>Comptes utilisateurs :</strong> conservés tant que le compte est actif, supprimés 3 ans après la dernière activité</li>
            <li><strong>Dossiers de candidature :</strong> conservés 5 ans après la décision finale</li>
            <li><strong>Données de navigation :</strong> conservées 13 mois maximum</li>
            <li><strong>Messages de contact :</strong> conservés 2 ans</li>
          </ul>

          <h2>6. Destinataires des données</h2>
          <p>
            Vos données peuvent être communiquées aux évaluateurs habilités dans le cadre
            du processus de labellisation, et aux structures d'accompagnement partenaires
            avec votre consentement préalable.
          </p>

          <h2>7. Sécurité</h2>
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées
            pour protéger vos données : chiffrement, contrôle d'accès, politiques de sécurité
            au niveau de la base de données (Row Level Security), et audits réguliers.
          </p>

          <h2>8. Vos droits</h2>
          <p>Conformément à la réglementation applicable, vous disposez des droits suivants :</p>
          <ul>
            <li>Droit d'accès à vos données personnelles</li>
            <li>Droit de rectification des données inexactes</li>
            <li>Droit à l'effacement (« droit à l'oubli »)</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité de vos données</li>
            <li>Droit d'opposition au traitement</li>
          </ul>
          <p>
            Pour exercer ces droits, contactez-nous à :{" "}
            <a href="mailto:contact@ivoirehub.ci" className="text-primary hover:underline">
              contact@ivoirehub.ci
            </a>
          </p>

          <h2>9. Cookies</h2>
          <p>
            Les cookies techniques sont indispensables au fonctionnement du site.
            Les cookies analytiques, s'ils sont utilisés, requièrent votre consentement préalable.
            Vous pouvez à tout moment modifier vos préférences de cookies dans les paramètres de votre navigateur.
          </p>

          <h2>10. Modifications</h2>
          <p>
            Cette politique peut être mise à jour à tout moment. La date de dernière mise à jour
            est indiquée en haut de page. Nous vous recommandons de consulter régulièrement cette page.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Confidentialite;
