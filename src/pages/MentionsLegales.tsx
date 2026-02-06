import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageBreadcrumb } from "@/components/shared/PageBreadcrumb";
import { SEOHead } from "@/components/shared/SEOHead";

const MentionsLegales = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Mentions légales"
        description="Mentions légales de la plateforme Ivoire Hub — labellisation des startups numériques en Côte d'Ivoire."
        path="/mentions-legales"
        noindex
      />
      <Navbar />
      <PageBreadcrumb currentLabel="Mentions légales" className="py-3 bg-muted/30 border-b border-border" />
      <main id="main-content" className="flex-grow">
        <div className="container mx-auto px-4 py-12 max-w-4xl prose prose-lg dark:prose-invert">
          <h1>Mentions légales</h1>

          <h2>Éditeur du site</h2>
          <p>
            <strong>Ivoire Hub</strong> est une plateforme éditée par le Ministère de la Communication
            et de l'Économie Numérique de la République de Côte d'Ivoire, en partenariat avec Etudesk.
          </p>
          <ul>
            <li><strong>Raison sociale :</strong> Ministère de la Communication et de l'Économie Numérique</li>
            <li><strong>Adresse :</strong> Abidjan, Plateau, Côte d'Ivoire</li>
            <li><strong>Email :</strong> contact@ivoirehub.ci</li>
            <li><strong>Téléphone :</strong> +225 27 22 XX XX XX</li>
          </ul>

          <h2>Directeur de la publication</h2>
          <p>Le directeur de la publication est le Ministre de la Communication et de l'Économie Numérique.</p>

          <h2>Hébergement</h2>
          <p>
            Ce site est hébergé par Lovable (Lovable Technologies Ltd). Les données sont stockées
            dans des centres de données sécurisés conformes aux standards internationaux.
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            L'ensemble des contenus présents sur ce site (textes, images, graphismes, logo, icônes, etc.)
            sont protégés par le droit d'auteur et le droit de la propriété intellectuelle.
            Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie
            des éléments du site est interdite sans autorisation écrite préalable.
          </p>

          <h2>Données personnelles</h2>
          <p>
            Les informations collectées via ce site sont traitées conformément à notre{" "}
            <a href="/confidentialite" className="text-primary hover:underline">politique de confidentialité</a>.
            Conformément à la loi ivoirienne relative à la protection des données personnelles,
            vous disposez d'un droit d'accès, de rectification et de suppression de vos données.
          </p>

          <h2>Cookies</h2>
          <p>
            Ce site utilise des cookies techniques nécessaires à son fonctionnement.
            Des cookies analytiques peuvent être utilisés pour mesurer l'audience du site,
            sous réserve de votre consentement.
          </p>

          <h2>Loi applicable</h2>
          <p>
            Les présentes mentions légales sont régies par le droit ivoirien.
            En cas de litige, les tribunaux d'Abidjan seront seuls compétents.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MentionsLegales;
