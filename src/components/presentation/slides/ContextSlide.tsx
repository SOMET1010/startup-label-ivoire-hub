import SlideLayout from "../SlideLayout";
import { Globe, TrendingUp, Lightbulb, Users } from "lucide-react";

const stats = [
  { icon: TrendingUp, value: "8%", label: "Croissance du PIB numérique" },
  { icon: Lightbulb, value: "5 000+", label: "Startups en Côte d'Ivoire" },
  { icon: Users, value: "60%", label: "Population de moins de 25 ans" },
];

const ContextSlide = () => (
  <SlideLayout>
    <div className="flex flex-col h-full text-white px-24 py-20">
      <div className="flex items-center gap-4 mb-2">
        <Globe className="w-10 h-10 text-amber-300" />
        <span className="text-[20px] text-amber-300 font-semibold uppercase tracking-widest">Contexte</span>
      </div>
      <h2 className="text-[52px] font-bold mb-4">L'Afrique innove. La Côte d'Ivoire accélère.</h2>
      <div className="h-1 w-24 bg-amber-400 rounded-full mb-10" />

      <div className="bg-white/10 backdrop-blur rounded-2xl p-8 mb-10">
        <p className="text-[26px] leading-relaxed">
          La <span className="font-bold text-amber-300">Loi n° 2023-901</span> crée le premier cadre légal 
          de labellisation des startups en Afrique de l'Ouest. Un signal fort pour les entrepreneurs, 
          les investisseurs et tout l'écosystème d'innovation.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8 flex-1">
        {stats.map((s) => (
          <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl p-8 flex flex-col items-center justify-center text-center">
            <s.icon className="w-14 h-14 text-amber-300 mb-4" />
            <span className="text-[56px] font-bold">{s.value}</span>
            <span className="text-[20px] text-white/70 mt-2">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

export default ContextSlide;
