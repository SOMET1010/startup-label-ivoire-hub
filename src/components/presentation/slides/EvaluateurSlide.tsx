import SlideLayout from "../SlideLayout";
import { ClipboardCheck, CheckCircle } from "lucide-react";

const features = [
  "Grille de notation standardisée (/20)",
  "Vote avec système de quorum",
  "Commentaires par critère",
  "Fils de discussion par dossier",
  "Synthèse automatique des évaluations",
  "Indicateurs de progression des votes",
  "Historique des décisions",
];

const EvaluateurSlide = () => (
  <SlideLayout>
    <div className="flex flex-col h-full text-white px-24 py-20">
      <div className="flex items-center gap-4 mb-2">
        <ClipboardCheck className="w-10 h-10 text-amber-300" />
        <span className="text-[20px] text-amber-300 font-semibold uppercase tracking-widest">Slide 6</span>
      </div>
      <h2 className="text-[52px] font-bold mb-4">Espace Évaluateur</h2>
      <div className="h-1 w-24 bg-amber-400 rounded-full mb-10" />

      <div className="flex gap-10 flex-1">
        <div className="flex-1 flex flex-col gap-4">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-4 bg-white/10 backdrop-blur rounded-xl px-6 py-5">
              <CheckCircle className="w-7 h-7 text-emerald-300 flex-shrink-0" />
              <span className="text-[22px]">{f}</span>
            </div>
          ))}
        </div>

        <div className="w-[500px] bg-white/10 backdrop-blur rounded-2xl p-8 flex flex-col justify-center">
          <h3 className="text-[28px] font-bold mb-6 text-amber-300">Grille de notation</h3>
          <div className="space-y-4">
            {["Innovation", "Modèle économique", "Équipe", "Impact"].map((c) => (
              <div key={c} className="flex justify-between items-center">
                <span className="text-[22px]">{c}</span>
                <span className="text-[22px] font-bold text-amber-300">/5</span>
              </div>
            ))}
            <div className="h-px bg-white/20 my-2" />
            <div className="flex justify-between items-center">
              <span className="text-[24px] font-bold">Total</span>
              <span className="text-[24px] font-bold text-amber-300">/20</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SlideLayout>
);

export default EvaluateurSlide;
