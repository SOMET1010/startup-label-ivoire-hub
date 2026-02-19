import SlideLayout from "../SlideLayout";
import { BarChart3, TrendingUp, Award, Clock, Users, MapPin } from "lucide-react";

const kpis = [
  { icon: TrendingUp, value: "200+", label: "Candidatures attendues", sub: "Année 1" },
  { icon: Award, value: "50+", label: "Startups labellisées", sub: "Objectif Année 1" },
  { icon: Clock, value: "<30j", label: "Délai de décision", sub: "Du dépôt au résultat" },
  { icon: Users, value: "100+", label: "Investisseurs connectés", sub: "Nationaux & internationaux" },
  { icon: MapPin, value: "10+", label: "Structures partenaires", sub: "Incubateurs & accélérateurs" },
  { icon: BarChart3, value: "24/7", label: "Plateforme accessible", sub: "Partout dans le monde" },
];

const ArchitectureSlide = () => (
  <SlideLayout>
    <div className="flex flex-col h-full text-white px-24 py-20">
      <div className="flex items-center gap-4 mb-2">
        <BarChart3 className="w-10 h-10 text-amber-300" />
        <span className="text-[20px] text-amber-300 font-semibold uppercase tracking-widest">Objectifs</span>
      </div>
      <h2 className="text-[52px] font-bold mb-4">Des objectifs ambitieux et mesurables</h2>
      <div className="h-1 w-24 bg-amber-400 rounded-full mb-10" />

      <div className="grid grid-cols-3 gap-8 flex-1">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white/10 backdrop-blur rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <k.icon className="w-14 h-14 text-amber-300 mb-4" />
            <span className="text-[56px] font-bold">{k.value}</span>
            <span className="text-[22px] font-semibold mt-2">{k.label}</span>
            <span className="text-[18px] text-white/50 mt-1">{k.sub}</span>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

export default ArchitectureSlide;
