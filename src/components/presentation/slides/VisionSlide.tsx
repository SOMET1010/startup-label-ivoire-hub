import SlideLayout from "../SlideLayout";
import { Target, Zap, Shield, Handshake } from "lucide-react";

const pillars = [
  { icon: Zap, title: "Simplicité", desc: "Un parcours 100% digital, de la candidature à la labellisation, en moins de 30 jours" },
  { icon: Shield, title: "Confiance", desc: "Un processus transparent et sécurisé, piloté par un comité d'experts indépendants" },
  { icon: Handshake, title: "Écosystème", desc: "Connecter startups, investisseurs et structures d'accompagnement sur une même plateforme" },
];

const VisionSlide = () => (
  <SlideLayout>
    <div className="flex flex-col h-full text-white px-24 py-20">
      <div className="flex items-center gap-4 mb-2">
        <Target className="w-10 h-10 text-amber-300" />
        <span className="text-[20px] text-amber-300 font-semibold uppercase tracking-widest">Vision</span>
      </div>
      <h2 className="text-[52px] font-bold mb-4">Notre ambition</h2>
      <div className="h-1 w-24 bg-amber-400 rounded-full mb-10" />

      <p className="text-[28px] text-white/80 mb-12 max-w-[1400px]">
        Faire de la Côte d'Ivoire la <span className="font-bold text-amber-300">référence en Afrique</span> pour 
        l'identification, la reconnaissance et l'accompagnement des startups innovantes.
      </p>

      <div className="grid grid-cols-3 gap-8 flex-1">
        {pillars.map((p) => (
          <div key={p.title} className="bg-white/10 backdrop-blur rounded-2xl p-10 flex flex-col items-center text-center">
            <p.icon className="w-16 h-16 text-amber-300 mb-6" />
            <h3 className="text-[32px] font-bold mb-4">{p.title}</h3>
            <p className="text-[22px] text-white/70 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

export default VisionSlide;
