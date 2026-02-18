import SlideLayout from "../SlideLayout";
import { Server, Database, Cloud, Zap } from "lucide-react";

const stack = [
  { icon: Zap, name: "Frontend", items: ["React 18 + TypeScript", "Vite (build)", "Tailwind CSS + shadcn/ui", "Framer Motion"] },
  { icon: Database, name: "Backend", items: ["PostgreSQL (27 tables)", "Row Level Security", "Edge Functions (14)", "Realtime subscriptions"] },
  { icon: Cloud, name: "Infrastructure", items: ["Lovable Cloud", "CDN mondial", "Auto-scaling", "CI/CD intégré"] },
  { icon: Server, name: "Services", items: ["Auth JWT + RBAC", "Storage sécurisé", "Push notifications", "Email transactionnel"] },
];

const ArchitectureSlide = () => (
  <SlideLayout>
    <div className="flex flex-col h-full text-white px-24 py-20">
      <div className="flex items-center gap-4 mb-2">
        <Server className="w-10 h-10 text-amber-300" />
        <span className="text-[20px] text-amber-300 font-semibold uppercase tracking-widest">Slide 9</span>
      </div>
      <h2 className="text-[52px] font-bold mb-4">Architecture Technique</h2>
      <div className="h-1 w-24 bg-amber-400 rounded-full mb-10" />

      <div className="grid grid-cols-4 gap-6 flex-1">
        {stack.map((s) => (
          <div key={s.name} className="bg-white/10 backdrop-blur rounded-2xl p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <s.icon className="w-10 h-10 text-amber-300" />
              <h3 className="text-[24px] font-bold">{s.name}</h3>
            </div>
            <div className="space-y-3 flex-1">
              {s.items.map((item, i) => (
                <div key={i} className="bg-white/10 rounded-lg px-4 py-3 text-[19px]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

export default ArchitectureSlide;
