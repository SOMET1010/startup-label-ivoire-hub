import SlideLayout from "../SlideLayout";
import { Award } from "lucide-react";

const TitleSlide = () => (
  <SlideLayout>
    <div className="flex flex-col items-center justify-center h-full text-white text-center px-20">
      <div className="flex items-center gap-6 mb-8">
        <img src="/images/armoiries-ci.svg" alt="Armoiries CI" className="h-28 w-auto" />
        <Award className="w-20 h-20 text-amber-300" />
      </div>
      <h1 className="text-[72px] font-bold leading-tight mb-4 tracking-tight">
        Label Startup
      </h1>
      <h2 className="text-[48px] font-light mb-8 text-white/90">
        Côte d'Ivoire
      </h2>
      <div className="h-1 w-40 bg-amber-400 rounded-full mb-10" />
      <p className="text-[28px] text-white/80 mb-4">
        Plateforme nationale de labellisation des startups innovantes
      </p>
      <div className="flex items-center gap-8 mt-6 text-[22px] text-white/60">
        <span>MTNI</span>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        <span>ANSUT</span>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        <span>Version 2.0</span>
      </div>
    </div>
  </SlideLayout>
);

export default TitleSlide;
