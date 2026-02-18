import SlideLayout from "../SlideLayout";
import { Shield, Lock, Eye, FileCheck, KeyRound, Accessibility } from "lucide-react";

const items = [
  { icon: Lock, title: "Row Level Security", desc: "Politiques RLS sur chaque table, accès contrôlé par rôle" },
  { icon: KeyRound, title: "JWT & RBAC", desc: "5 rôles (admin, startup, evaluator, structure, investor)" },
  { icon: Shield, title: "HIBP", desc: "Détection de mots de passe compromis via Have I Been Pwned" },
  { icon: Eye, title: "URLs signées", desc: "Documents accessibles uniquement via URLs temporaires" },
  { icon: FileCheck, title: "RGPD", desc: "Consentement, droit à l'oubli, audit trail complet" },
  { icon: Accessibility, title: "WCAG 2.1 AA", desc: "Skip links, contrastes, navigation clavier, aria-labels" },
];

const SecuritySlide = () => (
  <SlideLayout>
    <div className="flex flex-col h-full text-white px-24 py-20">
      <div className="flex items-center gap-4 mb-2">
        <Shield className="w-10 h-10 text-amber-300" />
        <span className="text-[20px] text-amber-300 font-semibold uppercase tracking-widest">Slide 10</span>
      </div>
      <h2 className="text-[52px] font-bold mb-4">Sécurité & Conformité</h2>
      <div className="h-1 w-24 bg-amber-400 rounded-full mb-10" />

      <div className="grid grid-cols-3 gap-6 flex-1">
        {items.map((item) => (
          <div key={item.title} className="bg-white/10 backdrop-blur rounded-2xl p-6 flex flex-col items-start">
            <item.icon className="w-12 h-12 text-amber-300 mb-4" />
            <h3 className="text-[26px] font-bold mb-2">{item.title}</h3>
            <p className="text-[19px] text-white/70 leading-snug">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

export default SecuritySlide;
