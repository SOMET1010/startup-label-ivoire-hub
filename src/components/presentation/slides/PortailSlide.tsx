import SlideLayout from "../SlideLayout";
import { Layers, ArrowRight } from "lucide-react";

const steps = [
  { num: "01", title: "Découvrir", desc: "Comprendre les critères et vérifier son éligibilité en quelques minutes" },
  { num: "02", title: "Postuler", desc: "Déposer son dossier en ligne avec un formulaire guidé étape par étape" },
  { num: "03", title: "Évaluer", desc: "Un comité d'experts analyse chaque dossier selon 4 critères clés" },
  { num: "04", title: "Labelliser", desc: "Obtenir le Label officiel et accéder à tout l'écosystème de soutien" },
];

const PortailSlide = () => (
  <SlideLayout>
    <div className="flex flex-col h-full text-white px-24 py-20">
      <div className="flex items-center gap-4 mb-2">
        <Layers className="w-10 h-10 text-amber-300" />
        <span className="text-[20px] text-amber-300 font-semibold uppercase tracking-widest">Comment ça marche</span>
      </div>
      <h2 className="text-[52px] font-bold mb-4">Un parcours simple en 4 étapes</h2>
      <div className="h-1 w-24 bg-amber-400 rounded-full mb-12" />

      <div className="flex gap-6 flex-1 items-stretch">
        {steps.map((s, i) => (
          <div key={s.num} className="flex-1 flex items-center gap-4">
            <div className="flex-1 bg-white/10 backdrop-blur rounded-2xl p-8 flex flex-col h-full justify-center">
              <span className="text-[64px] font-bold text-amber-300/40 mb-2">{s.num}</span>
              <h3 className="text-[32px] font-bold mb-3">{s.title}</h3>
              <p className="text-[20px] text-white/70 leading-relaxed">{s.desc}</p>
            </div>
            {i < steps.length - 1 && (
              <ArrowRight className="w-10 h-10 text-amber-300/50 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

export default PortailSlide;
