import SlideLayout from "../SlideLayout";
import { Heart, Mail, Phone, Globe } from "lucide-react";

const MerciSlide = () => (
  <SlideLayout>
    <div className="flex flex-col items-center justify-center h-full text-white text-center px-20">
      <Heart className="w-16 h-16 text-amber-300 mb-6" />
      <h2 className="text-[64px] font-bold mb-4">Merci</h2>
      <p className="text-[28px] text-white/80 mb-12 max-w-[900px]">
        Pour toute question sur la plateforme Label Startup Côte d'Ivoire
      </p>

      <div className="grid grid-cols-3 gap-8 w-full max-w-[1200px]">
        {[
          { icon: Globe, title: "MTNI", desc: "Ministère de la Transition Numérique et de l'Innovation", link: "www.numerique.gouv.ci" },
          { icon: Mail, title: "Support", desc: "Équipe technique de la plateforme", link: "support@label-startup.ci" },
          { icon: Phone, title: "ANSUT", desc: "Agence Nationale du Service Universel des Télécoms", link: "www.ansut.ci" },
        ].map((c) => (
          <div key={c.title} className="bg-white/10 backdrop-blur rounded-2xl p-8 flex flex-col items-center">
            <c.icon className="w-10 h-10 text-amber-300 mb-4" />
            <h3 className="text-[26px] font-bold mb-2">{c.title}</h3>
            <p className="text-[18px] text-white/60 mb-3">{c.desc}</p>
            <span className="text-[18px] text-amber-300">{c.link}</span>
          </div>
        ))}
      </div>

      <div className="mt-12 flex items-center gap-4">
        <img src="/images/armoiries-ci.svg" alt="Armoiries CI" className="h-12 w-auto opacity-60" />
        <span className="text-[18px] text-white/40">République de Côte d'Ivoire — 2026</span>
      </div>
    </div>
  </SlideLayout>
);

export default MerciSlide;
