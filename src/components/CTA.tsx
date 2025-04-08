
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-ivoire-orange to-ivoire-green text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à faire décoller votre startup ?</h2>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
          Rejoignez les startups innovantes qui transforment le paysage numérique de la Côte d'Ivoire
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/postuler">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-ivoire-orange hover:bg-gray-100">
              Postuler maintenant
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
              Nous contacter
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
