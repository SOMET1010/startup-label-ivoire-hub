import SlideLayout from "../SlideLayout";
import { Shield, Lock, Globe, FileCheck, Accessibility, Eye } from "lucide-react";

const guarantees = [
  { icon: Lock, title: "Données protégées", desc: "Chiffrement de bout en bout et contrôle d'accès strict pour toutes les informations sensibles" },
  { icon: FileCheck, title: "Conformité RGPD", desc: "Respect total de la réglementation sur la protection des données personnelles" },
  { icon: Globe, title: "Normes internationales", desc: "Standards de sécurité alignés sur les meilleures pratiques mondiales" },
  { icon: Eye, title: "Transparence totale", desc: "Traçabilité complète de chaque action sur la plateforme" },
  { icon: Accessibility, title: "Accessibilité universelle", desc: "Plateforme conçue pour être utilisable par tous, conforme WCAG 2.1" },
  { icon: Shield, title: "Souveraineté numérique", desc: "Infrastructure sécurisée garantissant la maîtrise des données nationales" },
];

const SecuritySlide = () => (
  <SlideLayout>
    <div className="flex flex-col h-full text-white px-24 py-20">
      <div className="flex items-center gap-4 mb-2">
        <Shield className="w-10 h-10 text-amber-300" />
        <span className="text-[20px] text-amber-300 font-semibold uppercase tracking-widest">Confiance & sécurité</span>
      </div>
      <h2 className="text-[52px] font-bold mb-4">Une plateforme de confiance</h2>
      <div className="h-1 w-24 bg-amber-400 rounded-full mb-10" />

      <div className="grid grid-cols-3 gap-6 flex-1">
        {guarantees.map((g) => (
          <div key={g.title} className="bg-white/10 backdrop-blur rounded-2xl p-8 flex flex-col items-start">
            <g.icon className="w-12 h-12 text-amber-300 mb-5" />
            <h3 className="text-[26px] font-bold mb-3">{g.title}</h3>
            <p className="text-[20px] text-white/70 leading-relaxed">{g.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

export default SecuritySlide;
