import SlideLayout from "../SlideLayout";
import { Globe, CheckCircle } from "lucide-react";

const features = [
  "Page d'accueil institutionnelle",
  "Critères d'éligibilité détaillés",
  "Quiz d'auto-évaluation interactif",
  "Formulaire de candidature multi-étapes",
  "Annuaire des startups labellisées",
  "Actualités & événements",
  "FAQ dynamique",
  "Cartographie IA de l'écosystème",
  "Page investisseurs",
  "Accompagnement & structures",
];

const PortailSlide = () => (
  <SlideLayout>
    <div className="flex flex-col h-full text-white px-24 py-20">
      <div className="flex items-center gap-4 mb-2">
        <Globe className="w-10 h-10 text-amber-300" />
        <span className="text-[20px] text-amber-300 font-semibold uppercase tracking-widest">Slide 4</span>
      </div>
      <h2 className="text-[52px] font-bold mb-4">Portail Public</h2>
      <div className="h-1 w-24 bg-amber-400 rounded-full mb-10" />

      <div className="grid grid-cols-2 gap-4 flex-1">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-4 bg-white/10 backdrop-blur rounded-xl px-6 py-5">
            <CheckCircle className="w-7 h-7 text-emerald-300 flex-shrink-0" />
            <span className="text-[22px]">{f}</span>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

export default PortailSlide;
