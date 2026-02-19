import SlideLayout from "../SlideLayout";
import { Rocket, CheckCircle2 } from "lucide-react";

const milestones = [
  { period: "Q1 2026", label: "Lancement de la plateforme", status: "done" },
  { period: "Q2 2026", label: "Premières candidatures et labellisations", status: "current" },
  { period: "Q3 2026", label: "Ouverture aux investisseurs internationaux", status: "upcoming" },
  { period: "Q4 2026", label: "100 startups labellisées", status: "upcoming" },
  { period: "2027", label: "Extension régionale CEDEAO", status: "upcoming" },
];

const PlanningSlide = () => (
  <SlideLayout>
    <div className="flex flex-col h-full text-white px-24 py-20">
      <div className="flex items-center gap-4 mb-2">
        <Rocket className="w-10 h-10 text-amber-300" />
        <span className="text-[20px] text-amber-300 font-semibold uppercase tracking-widest">Feuille de route</span>
      </div>
      <h2 className="text-[52px] font-bold mb-4">Une montée en puissance progressive</h2>
      <div className="h-1 w-24 bg-amber-400 rounded-full mb-10" />

      <div className="flex-1 flex items-center">
        <div className="w-full space-y-8">
          {milestones.map((m, i) => (
            <div key={i} className="flex items-center gap-8">
              <div className="w-[160px] text-right text-[26px] font-bold text-amber-300">{m.period}</div>
              <div className="relative">
                <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center ${
                  m.status === "done" ? "bg-emerald-400 border-emerald-300" :
                  m.status === "current" ? "bg-amber-400 border-amber-300 animate-pulse" :
                  "bg-white/20 border-white/30"
                }`}>
                  {m.status === "done" && <CheckCircle2 className="w-6 h-6 text-white" />}
                </div>
                {i < milestones.length - 1 && (
                  <div className={`absolute top-10 left-4 w-1.5 h-12 rounded-full ${
                    m.status === "done" ? "bg-emerald-400/50" : "bg-white/20"
                  }`} />
                )}
              </div>
              <div className={`flex-1 bg-white/10 backdrop-blur rounded-xl px-8 py-5 text-[24px] ${
                m.status === "current" ? "ring-2 ring-amber-400/50" : ""
              }`}>
                {m.label}
                {m.status === "done" && <span className="ml-4 text-[18px] text-emerald-300 font-semibold">✓ Réalisé</span>}
                {m.status === "current" && <span className="ml-4 text-[18px] text-amber-300 font-semibold">▶ En cours</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </SlideLayout>
);

export default PlanningSlide;
