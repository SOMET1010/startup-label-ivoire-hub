import SlideLayout from "../SlideLayout";
import { Target, TrendingUp, Clock, Award } from "lucide-react";

const kpis = [
  { icon: TrendingUp, value: "200+", label: "Candidatures Année 1" },
  { icon: Award, value: "50+", label: "Startups labellisées" },
  { icon: Clock, value: "<30j", label: "Délai de décision" },
];

const VisionSlide = () => (
  <SlideLayout>
    <div className="flex flex-col h-full text-white px-24 py-20">
      <div className="flex items-center gap-4 mb-2">
        <Target className="w-10 h-10 text-amber-300" />
        <span className="text-[20px] text-amber-300 font-semibold uppercase tracking-widest">Slide 3</span>
      </div>
      <h2 className="text-[52px] font-bold mb-4">Vision & Objectifs Stratégiques</h2>
      <div className="h-1 w-24 bg-amber-400 rounded-full mb-10" />

      <div className="flex-1 flex flex-col gap-8">
        <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
          <h3 className="text-[30px] font-bold mb-3">Guichet unique numérique</h3>
          <p className="text-[22px] text-white/80 leading-relaxed">
            Centraliser l'ensemble du processus de labellisation — de la candidature à la décision
            du comité — dans une plateforme sécurisée, transparente et accessible 24h/24.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8 flex-1">
          {kpis.map((k) => (
            <div key={k.label} className="bg-white/10 backdrop-blur rounded-xl p-8 flex flex-col items-center justify-center text-center">
              <k.icon className="w-14 h-14 text-amber-300 mb-4" />
              <span className="text-[56px] font-bold">{k.value}</span>
              <span className="text-[20px] text-white/70 mt-2">{k.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </SlideLayout>
);

export default VisionSlide;
