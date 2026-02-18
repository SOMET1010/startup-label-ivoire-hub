import SlideLayout from "../SlideLayout";
import { Calendar, CheckCircle } from "lucide-react";

const milestones = [
  { period: "Jan 2026", label: "Kick-off & Architecture", status: "done" },
  { period: "Fév 2026", label: "Sprint 1 — Portail public + Auth", status: "done" },
  { period: "Mars 2026", label: "Sprint 2 — Espace Startup + Évaluateur", status: "done" },
  { period: "Avr 2026", label: "Sprint 3 — Admin + SAE + Investisseur", status: "done" },
  { period: "Mai 2026", label: "Recette & Tests utilisateurs", status: "current" },
  { period: "Juin 2026", label: "Mise en production", status: "upcoming" },
];

const PlanningSlide = () => (
  <SlideLayout>
    <div className="flex flex-col h-full text-white px-24 py-20">
      <div className="flex items-center gap-4 mb-2">
        <Calendar className="w-10 h-10 text-amber-300" />
        <span className="text-[20px] text-amber-300 font-semibold uppercase tracking-widest">Slide 11</span>
      </div>
      <h2 className="text-[52px] font-bold mb-4">Planning & Jalons</h2>
      <div className="h-1 w-24 bg-amber-400 rounded-full mb-10" />

      <div className="flex-1 flex items-center">
        <div className="w-full space-y-6">
          {milestones.map((m, i) => (
            <div key={i} className="flex items-center gap-6">
              <div className="w-[140px] text-right text-[22px] font-bold text-amber-300">{m.period}</div>
              <div className="relative">
                <div className={`w-8 h-8 rounded-full border-4 ${
                  m.status === "done" ? "bg-emerald-400 border-emerald-300" :
                  m.status === "current" ? "bg-amber-400 border-amber-300 animate-pulse" :
                  "bg-white/20 border-white/30"
                }`}>
                  {m.status === "done" && <CheckCircle className="w-5 h-5 text-white absolute top-0.5 left-0.5" />}
                </div>
                {i < milestones.length - 1 && (
                  <div className={`absolute top-8 left-3.5 w-1 h-10 ${
                    m.status === "done" ? "bg-emerald-400/50" : "bg-white/20"
                  }`} />
                )}
              </div>
              <div className={`flex-1 bg-white/10 backdrop-blur rounded-xl px-6 py-4 text-[22px] ${
                m.status === "current" ? "ring-2 ring-amber-400/50" : ""
              }`}>
                {m.label}
                {m.status === "done" && <span className="ml-3 text-[16px] text-emerald-300 font-semibold">✓ Livré</span>}
                {m.status === "current" && <span className="ml-3 text-[16px] text-amber-300 font-semibold">▶ En cours</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </SlideLayout>
);

export default PlanningSlide;
