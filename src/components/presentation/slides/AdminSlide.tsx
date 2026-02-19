import SlideLayout from "../SlideLayout";
import { Banknote, TrendingUp, MapPin, Briefcase, MessageSquare, Search } from "lucide-react";

const benefits = [
  { icon: Search, title: "Découvrir les pépites", desc: "Accès à l'annuaire complet des startups labellisées par l'État" },
  { icon: TrendingUp, title: "Investir en confiance", desc: "Des startups évaluées et certifiées selon des critères rigoureux" },
  { icon: MessageSquare, title: "Contact direct", desc: "Messagerie intégrée pour échanger avec les fondateurs" },
  { icon: Briefcase, title: "Matchmaking intelligent", desc: "Trouvez les startups qui correspondent à vos critères d'investissement" },
  { icon: MapPin, title: "Écosystème cartographié", desc: "Visualisez l'innovation ivoirienne sur une carte interactive" },
  { icon: Banknote, title: "Suivi du portefeuille", desc: "Historique complet de vos marques d'intérêt et interactions" },
];

const AdminSlide = () => (
  <SlideLayout>
    <div className="flex flex-col h-full text-white px-24 py-20">
      <div className="flex items-center gap-4 mb-2">
        <Banknote className="w-10 h-10 text-amber-300" />
        <span className="text-[20px] text-amber-300 font-semibold uppercase tracking-widest">Pour les investisseurs</span>
      </div>
      <h2 className="text-[52px] font-bold mb-4">Investissez dans l'innovation ivoirienne</h2>
      <div className="h-1 w-24 bg-amber-400 rounded-full mb-10" />

      <div className="grid grid-cols-3 gap-6 flex-1">
        {benefits.map((b) => (
          <div key={b.title} className="bg-white/10 backdrop-blur rounded-2xl p-8 flex flex-col">
            <b.icon className="w-12 h-12 text-amber-300 mb-5" />
            <h3 className="text-[26px] font-bold mb-3">{b.title}</h3>
            <p className="text-[20px] text-white/70 leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

export default AdminSlide;
