import SlideLayout from "../SlideLayout";
import { Building, Banknote, CheckCircle } from "lucide-react";

const saeFeatures = [
  "Gestion des programmes d'accompagnement",
  "Suivi des startups accompagnées",
  "Rapports d'activité",
  "Profil et visibilité",
];

const investorFeatures = [
  "Annuaire des startups labellisées",
  "Marques d'intérêt & matchmaking",
  "Messagerie directe",
  "Profil investisseur personnalisé",
  "Historique des interactions",
];

const SAEInvestorSlide = () => (
  <SlideLayout>
    <div className="flex flex-col h-full text-white px-24 py-20">
      <div className="flex items-center gap-4 mb-2">
        <Building className="w-10 h-10 text-amber-300" />
        <span className="text-[20px] text-amber-300 font-semibold uppercase tracking-widest">Slide 8</span>
      </div>
      <h2 className="text-[52px] font-bold mb-4">Espaces SAE & Investisseur</h2>
      <div className="h-1 w-24 bg-amber-400 rounded-full mb-10" />

      <div className="flex gap-8 flex-1">
        <div className="flex-1 bg-white/10 backdrop-blur rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Building className="w-8 h-8 text-amber-300" />
            <h3 className="text-[28px] font-bold">Structures d'Accompagnement</h3>
          </div>
          <div className="space-y-4">
            {saeFeatures.map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <CheckCircle className="w-6 h-6 text-emerald-300 flex-shrink-0" />
                <span className="text-[22px]">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-white/10 backdrop-blur rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Banknote className="w-8 h-8 text-amber-300" />
            <h3 className="text-[28px] font-bold">Investisseurs</h3>
          </div>
          <div className="space-y-4">
            {investorFeatures.map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <CheckCircle className="w-6 h-6 text-emerald-300 flex-shrink-0" />
                <span className="text-[22px]">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </SlideLayout>
);

export default SAEInvestorSlide;
