import SlideLayout from "../SlideLayout";
import { Building, GraduationCap, Users, Lightbulb, Network } from "lucide-react";

const partners = [
  { icon: GraduationCap, name: "Incubateurs", desc: "Accompagnez les startups dès leur phase d'idéation" },
  { icon: Building, name: "Accélérateurs", desc: "Propulsez la croissance des startups les plus prometteuses" },
  { icon: Lightbulb, name: "Centres d'innovation", desc: "Offrez un cadre propice à l'expérimentation" },
  { icon: Network, name: "Organisations sectorielles", desc: "Connectez les startups à votre réseau d'experts" },
];

const SAEInvestorSlide = () => (
  <SlideLayout>
    <div className="flex flex-col h-full text-white px-24 py-20">
      <div className="flex items-center gap-4 mb-2">
        <Users className="w-10 h-10 text-amber-300" />
        <span className="text-[20px] text-amber-300 font-semibold uppercase tracking-widest">Écosystème</span>
      </div>
      <h2 className="text-[52px] font-bold mb-4">Un réseau de partenaires engagés</h2>
      <div className="h-1 w-24 bg-amber-400 rounded-full mb-10" />

      <p className="text-[26px] text-white/80 mb-10 max-w-[1200px]">
        La plateforme connecte les <span className="font-bold text-amber-300">structures d'accompagnement</span> à 
        un vivier de startups labellisées, créant un écosystème vertueux d'innovation.
      </p>

      <div className="grid grid-cols-4 gap-6 flex-1">
        {partners.map((p) => (
          <div key={p.name} className="bg-white/10 backdrop-blur rounded-2xl p-8 flex flex-col items-center text-center">
            <p.icon className="w-14 h-14 text-amber-300 mb-5" />
            <h3 className="text-[26px] font-bold mb-3">{p.name}</h3>
            <p className="text-[19px] text-white/70 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

export default SAEInvestorSlide;
