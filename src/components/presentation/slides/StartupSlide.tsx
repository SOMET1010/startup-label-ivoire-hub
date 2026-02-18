import SlideLayout from "../SlideLayout";
import { Rocket, CheckCircle } from "lucide-react";

const features = [
  "Candidature multi-étapes avec sauvegarde",
  "Upload de documents sécurisé",
  "Suivi en temps réel du dossier",
  "Coach IA personnalisé",
  "Notifications push & email",
  "Tableau de bord personnalisé",
  "Espace Label (post-labellisation)",
  "Réseau de startups labellisées",
  "Événements & opportunités exclusives",
  "Ressources & guides pratiques",
  "Renouvellement automatisé du label",
];

const StartupSlide = () => (
  <SlideLayout>
    <div className="flex flex-col h-full text-white px-24 py-20">
      <div className="flex items-center gap-4 mb-2">
        <Rocket className="w-10 h-10 text-amber-300" />
        <span className="text-[20px] text-amber-300 font-semibold uppercase tracking-widest">Slide 5</span>
      </div>
      <h2 className="text-[52px] font-bold mb-4">Espace Startup</h2>
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

export default StartupSlide;
