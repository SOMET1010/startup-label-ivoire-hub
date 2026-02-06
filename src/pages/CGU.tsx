import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageBreadcrumb } from "@/components/shared/PageBreadcrumb";
import { SEOHead } from "@/components/shared/SEOHead";

const CGU = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Conditions Générales d'Utilisation"
        description="Conditions générales d'utilisation de la plateforme Ivoire Hub de labellisation des startups."
        path="/cgu"
        noindex
      />
      <Navbar />
      <PageBreadcrumb currentLabel="Conditions Générales d'Utilisation" className="py-3 bg-muted/30 border-b border-border" />
      <main id="main-content" className="flex-grow">
        <div className="container mx-auto px-4 py-12 max-w-4xl prose prose-lg dark:prose-invert">
          <h1>Conditions Générales d'Utilisation</h1>
          <p className="lead">
            Dernière mise à jour : février 2026
          </p>

          <h2>1. Objet</h2>
          <p>
            Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation
            de la plateforme Ivoire Hub, dédiée à la labellisation et à l'accompagnement des startups
            numériques en Côte d'Ivoire.
          </p>

          <h2>2. Accès à la plateforme</h2>
          <p>
            L'accès à la plateforme est ouvert à toute personne physique ou morale souhaitant
            s'informer sur le programme de labellisation ou y participer. La création d'un compte
            est nécessaire pour soumettre une candidature ou accéder aux services réservés.
          </p>

          <h2>3. Inscription et compte utilisateur</h2>
          <ul>
            <li>L'inscription est gratuite et nécessite une adresse email valide</li>
            <li>L'utilisateur s'engage à fournir des informations exactes et à jour</li>
            <li>Chaque utilisateur est responsable de la confidentialité de ses identifiants</li>
            <li>Un compte peut être de type : Startup, Structure d'accompagnement ou Investisseur</li>
          </ul>

          <h2>4. Processus de labellisation</h2>
          <p>
            La soumission d'un dossier de candidature ne garantit pas l'obtention du label.
            Le processus comprend :
          </p>
          <ol>
            <li>Soumission du dossier complet avec les documents requis</li>
            <li>Vérification de la recevabilité par l'administration</li>
            <li>Évaluation par un comité d'experts indépendants</li>
            <li>Décision finale et notification au candidat</li>
          </ol>
          <p>
            La décision du comité est souveraine. En cas de refus, le candidat peut soumettre
            une nouvelle candidature après un délai de 6 mois.
          </p>

          <h2>5. Obligations de l'utilisateur</h2>
          <p>L'utilisateur s'engage à :</p>
          <ul>
            <li>Utiliser la plateforme conformément à sa destination</li>
            <li>Ne pas fournir de fausses informations dans les dossiers de candidature</li>
            <li>Respecter les droits de propriété intellectuelle</li>
            <li>Ne pas tenter de contourner les mesures de sécurité de la plateforme</li>
            <li>Signaler toute utilisation frauduleuse de son compte</li>
          </ul>

          <h2>6. Propriété intellectuelle</h2>
          <p>
            Les contenus publiés sur la plateforme (textes, images, logos, graphismes)
            sont protégés par le droit de la propriété intellectuelle. Toute reproduction
            non autorisée est interdite.
          </p>
          <p>
            Les documents soumis dans le cadre d'une candidature restent la propriété
            de leur auteur. Ivoire Hub s'engage à ne les utiliser que dans le cadre
            du processus de labellisation.
          </p>

          <h2>7. Responsabilité</h2>
          <p>
            Ivoire Hub s'efforce d'assurer la disponibilité de la plateforme mais ne garantit pas
            un fonctionnement ininterrompu. La plateforme peut être temporairement indisponible
            pour des raisons de maintenance ou de mise à jour.
          </p>

          <h2>8. Protection des données</h2>
          <p>
            Le traitement des données personnelles est régi par notre{" "}
            <a href="/confidentialite" className="text-primary hover:underline">
              politique de confidentialité
            </a>
            .
          </p>

          <h2>9. Modification des CGU</h2>
          <p>
            Ivoire Hub se réserve le droit de modifier les présentes CGU à tout moment.
            Les modifications entrent en vigueur dès leur publication sur la plateforme.
            L'utilisation continue de la plateforme après modification vaut acceptation
            des nouvelles conditions.
          </p>

          <h2>10. Résiliation</h2>
          <p>
            Ivoire Hub se réserve le droit de suspendre ou supprimer un compte utilisateur
            en cas de non-respect des présentes CGU, après notification par email.
          </p>

          <h2>11. Droit applicable et juridiction</h2>
          <p>
            Les présentes CGU sont soumises au droit ivoirien. En cas de litige,
            les tribunaux d'Abidjan sont seuls compétents.
          </p>

          <h2>12. Contact</h2>
          <p>
            Pour toute question relative aux présentes CGU, contactez-nous à :{" "}
            <a href="mailto:contact@ivoirehub.ci" className="text-primary hover:underline">
              contact@ivoirehub.ci
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CGU;
