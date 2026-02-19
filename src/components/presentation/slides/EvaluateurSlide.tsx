import SlideLayout from "../SlideLayout";
import { ClipboardCheck, Star } from "lucide-react";

const criteria = [
  { name: "Innovation", desc: "Caractère novateur de la solution proposée", weight: "25%" },
  { name: "Modèle économique", desc: "Viabilité et potentiel de revenus", weight: "25%" },
  { name: "Équipe", desc: "Compétences et complémentarité des fondateurs", weight: "25%" },
  { name: "Impact", desc: "Retombées sociales, économiques et environnementales", weight: "25%" },
];

const EvaluateurSlide = () => (
  <SlideLayout>
    <div className="flex flex-col h-full text-white px-24 py-20">
      <div className="flex items-center gap-4 mb-2">
        <ClipboardCheck className="w-10 h-10 text-amber-300" />
        <span className="text-[20px] text-amber-300 font-semibold uppercase tracking-widest">Évaluation</span>
      </div>
      <h2 className="text-[52px] font-bold mb-4">Un processus rigoureux et transparent</h2>
      <div className="h-1 w-24 bg-amber-400 rounded-full mb-10" />

      <div className="flex gap-10 flex-1">
        <div className="flex-1 flex flex-col gap-5">
          {criteria.map((c) => (
            <div key={c.name} className="bg-white/10 backdrop-blur rounded-xl px-8 py-6 flex items-center gap-6">
              <div className="w-[80px] text-center">
                <span className="text-[36px] font-bold text-amber-300">{c.weight}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-[26px] font-bold mb-1">{c.name}</h3>
                <p className="text-[20px] text-white/70">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="w-[480px] bg-white/10 backdrop-blur rounded-2xl p-10 flex flex-col justify-center text-center">
          <Star className="w-16 h-16 text-amber-300 mx-auto mb-6" />
          <h3 className="text-[36px] font-bold mb-4">Comité indépendant</h3>
          <p className="text-[22px] text-white/70 leading-relaxed mb-6">
            Minimum 5 experts évaluent chaque dossier avec un système de vote à quorum
          </p>
          <div className="bg-white/10 rounded-xl p-5">
            <span className="text-[20px] text-white/60">Décision en </span>
            <span className="text-[32px] font-bold text-amber-300">moins de 30 jours</span>
          </div>
        </div>
      </div>
    </div>
  </SlideLayout>
);

export default EvaluateurSlide;
