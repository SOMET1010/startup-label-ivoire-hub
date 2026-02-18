import SlideLayout from "../SlideLayout";
import { Scale, Building2, Users, Landmark } from "lucide-react";

const actors = [
  { icon: Landmark, name: "MTNI", desc: "Ministère de la Transition Numérique et de l'Innovation" },
  { icon: Building2, name: "ANSUT", desc: "Agence Nationale du Service Universel des Télécoms" },
  { icon: Users, name: "Comité", desc: "Comité de labellisation (5 experts minimum)" },
  { icon: Scale, name: "SAE", desc: "Structures d'Accompagnement de l'Écosystème" },
];

const ContextSlide = () => (
  <SlideLayout>
    <div className="flex flex-col h-full text-white px-24 py-20">
      <div className="flex items-center gap-4 mb-2">
        <Scale className="w-10 h-10 text-amber-300" />
        <span className="text-[20px] text-amber-300 font-semibold uppercase tracking-widest">Slide 2</span>
      </div>
      <h2 className="text-[52px] font-bold mb-4">Contexte & Cadre Légal</h2>
      <div className="h-1 w-24 bg-amber-400 rounded-full mb-10" />

      <div className="bg-white/10 backdrop-blur rounded-2xl p-8 mb-10">
        <p className="text-[26px] leading-relaxed">
          <span className="font-bold text-amber-300">Loi n° 2023-901</span> relative à la promotion des startups
          en Côte d'Ivoire — instaure le <span className="font-bold">Label Startup</span> comme dispositif officiel
          de reconnaissance et de soutien aux entreprises innovantes.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6 flex-1">
        {actors.map((a) => (
          <div key={a.name} className="bg-white/10 backdrop-blur rounded-xl p-6 flex flex-col items-center text-center">
            <a.icon className="w-12 h-12 text-amber-300 mb-4" />
            <h3 className="text-[28px] font-bold mb-2">{a.name}</h3>
            <p className="text-[18px] text-white/70 leading-snug">{a.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

export default ContextSlide;
