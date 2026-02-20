import SlideLayout from "../SlideLayout";
import { ClipboardCheck, CheckCircle, AlertTriangle, Circle } from "lucide-react";

const categories = [
  { label: "Modules fonctionnels", ok: 42, partial: 5, missing: 1 },
  { label: "Backend & BDD", ok: 18, partial: 2, missing: 0 },
  { label: "Sécurité & conformité", ok: 10, partial: 1, missing: 0 },
  { label: "SEO & Performance", ok: 7, partial: 2, missing: 1 },
  { label: "Accessibilité (WCAG)", ok: 4, partial: 2, missing: 0 },
  { label: "Responsive Design", ok: 9, partial: 0, missing: 0 },
];

const totalOk = categories.reduce((s, c) => s + c.ok, 0);
const totalPartial = categories.reduce((s, c) => s + c.partial, 0);
const totalMissing = categories.reduce((s, c) => s + c.missing, 0);
const total = totalOk + totalPartial + totalMissing;
const pctOk = Math.round((totalOk / total) * 100);

const BilanSlide = () => (
  <SlideLayout>
    <div className="flex flex-col h-full text-white px-24 py-20">
      <div className="flex items-center gap-4 mb-2">
        <ClipboardCheck className="w-10 h-10 text-amber-300" />
        <span className="text-[20px] text-amber-300 font-semibold uppercase tracking-widest">Bilan d'avancement</span>
      </div>
      <h2 className="text-[52px] font-bold mb-4">Cahier des charges vs Réalisation</h2>
      <div className="h-1 w-24 bg-amber-400 rounded-full mb-10" />

      {/* Global progress */}
      <div className="flex items-center gap-10 mb-10">
        <div className="flex-1 bg-white/10 backdrop-blur rounded-2xl p-8 flex items-center gap-8">
          <div className="text-center">
            <span className="text-[72px] font-bold text-amber-300">{pctOk}%</span>
            <p className="text-[20px] text-white/60 mt-1">Complet</p>
          </div>
          <div className="flex-1">
            <div className="w-full h-6 bg-white/10 rounded-full overflow-hidden flex">
              <div className="h-full bg-emerald-400 rounded-l-full" style={{ width: `${(totalOk / total) * 100}%` }} />
              <div className="h-full bg-amber-400" style={{ width: `${(totalPartial / total) * 100}%` }} />
              <div className="h-full bg-red-400 rounded-r-full" style={{ width: `${(totalMissing / total) * 100}%` }} />
            </div>
            <div className="flex gap-8 mt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-[18px]">{totalOk} Complètes</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span className="text-[18px]">{totalPartial} Partielles</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle className="w-5 h-5 text-red-400" />
                <span className="text-[18px]">{totalMissing} Manquantes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="grid grid-cols-3 gap-5 flex-1">
        {categories.map((c) => {
          const catTotal = c.ok + c.partial + c.missing;
          const catPct = Math.round((c.ok / catTotal) * 100);
          return (
            <div key={c.label} className="bg-white/10 backdrop-blur rounded-2xl p-6 flex flex-col justify-between">
              <h3 className="text-[22px] font-bold mb-3">{c.label}</h3>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden flex mb-3">
                <div className="h-full bg-emerald-400" style={{ width: `${(c.ok / catTotal) * 100}%` }} />
                <div className="h-full bg-amber-400" style={{ width: `${(c.partial / catTotal) * 100}%` }} />
                <div className="h-full bg-red-400" style={{ width: `${(c.missing / catTotal) * 100}%` }} />
              </div>
              <div className="flex justify-between text-[17px]">
                <span className="text-emerald-400">{c.ok} ✓</span>
                <span className="text-amber-400">{c.partial} ◐</span>
                <span className="text-red-400">{c.missing} ✗</span>
                <span className="text-white/60 font-bold">{catPct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </SlideLayout>
);

export default BilanSlide;
