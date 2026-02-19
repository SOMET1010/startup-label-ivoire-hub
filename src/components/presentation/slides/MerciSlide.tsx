import SlideLayout from "../SlideLayout";
import { Sparkles, Globe, Mail, QrCode } from "lucide-react";

const MerciSlide = () => (
  <SlideLayout>
    <div className="flex flex-col items-center justify-center h-full text-white text-center px-20">
      <Sparkles className="w-20 h-20 text-amber-300 mb-8" />
      <h2 className="text-[72px] font-bold mb-4">Rejoignez le mouvement</h2>
      <p className="text-[28px] text-white/80 mb-14 max-w-[1000px]">
        Ensemble, construisons l'écosystème d'innovation de demain en Côte d'Ivoire et en Afrique
      </p>

      <div className="grid grid-cols-3 gap-8 w-full max-w-[1200px] mb-14">
        {[
          { icon: Globe, title: "Visitez la plateforme", desc: "label-startup.ci", sub: "Candidatez ou explorez l'annuaire" },
          { icon: Mail, title: "Contactez-nous", desc: "contact@label-startup.ci", sub: "Partenariats & investissements" },
          { icon: QrCode, title: "Scannez", desc: "Accès direct", sub: "Depuis votre mobile" },
        ].map((c) => (
          <div key={c.title} className="bg-white/10 backdrop-blur rounded-2xl p-8 flex flex-col items-center">
            <c.icon className="w-12 h-12 text-amber-300 mb-4" />
            <h3 className="text-[24px] font-bold mb-2">{c.title}</h3>
            <span className="text-[20px] text-amber-300 mb-1">{c.desc}</span>
            <span className="text-[17px] text-white/50">{c.sub}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <img src="/images/armoiries-ci.svg" alt="Armoiries CI" className="h-14 w-auto opacity-60" />
        <div className="text-left">
          <p className="text-[18px] text-white/60">République de Côte d'Ivoire</p>
          <p className="text-[16px] text-white/40">Ministère de la Transition Numérique • ANSUT</p>
        </div>
      </div>
    </div>
  </SlideLayout>
);

export default MerciSlide;
