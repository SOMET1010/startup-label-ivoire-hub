import SlideLayout from "../SlideLayout";
import { Award, Sparkles } from "lucide-react";

const TitleSlide = () => (
  <SlideLayout>
    <div className="flex flex-col items-center justify-center h-full text-white text-center px-20">
      <div className="flex items-center gap-6 mb-10">
        <img src="/images/armoiries-ci.svg" alt="Armoiries CI" className="h-32 w-auto" />
        <Award className="w-24 h-24 text-amber-300" />
      </div>
      <h1 className="text-[80px] font-bold leading-tight mb-4 tracking-tight">
        Label Startup
      </h1>
      <h2 className="text-[52px] font-light mb-6 text-white/90">
        Côte d'Ivoire
      </h2>
      <div className="h-1.5 w-48 bg-amber-400 rounded-full mb-10" />
      <p className="text-[30px] text-white/80 mb-3 max-w-[1100px]">
        Le premier guichet unique numérique pour reconnaître,
      </p>
      <p className="text-[30px] text-white/80 mb-8 max-w-[1100px]">
        accompagner et propulser les startups innovantes africaines
      </p>
      <div className="flex items-center gap-3 mt-4 bg-white/10 backdrop-blur rounded-full px-8 py-4">
        <Sparkles className="w-6 h-6 text-amber-300" />
        <span className="text-[22px] text-white/80">Ministère de la Transition Numérique & ANSUT</span>
      </div>
    </div>
  </SlideLayout>
);

export default TitleSlide;
