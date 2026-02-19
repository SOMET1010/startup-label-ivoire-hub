import SlideLayout from "../SlideLayout";
import { Rocket, Star, Bot, Bell, BarChart3, RefreshCw, FileText } from "lucide-react";

const benefits = [
  { icon: FileText, title: "Candidature simplifiée", desc: "Formulaire guidé avec sauvegarde automatique" },
  { icon: BarChart3, title: "Suivi en temps réel", desc: "Tableau de bord personnalisé avec l'état du dossier" },
  { icon: Bot, title: "Coach IA intégré", desc: "Un assistant intelligent pour optimiser votre candidature" },
  { icon: Bell, title: "Notifications instantanées", desc: "Restez informé à chaque étape du processus" },
  { icon: Star, title: "Espace Label exclusif", desc: "Événements, opportunités et réseau après labellisation" },
  { icon: RefreshCw, title: "Renouvellement simplifié", desc: "Processus automatisé pour conserver votre label" },
];

const StartupSlide = () => (
  <SlideLayout>
    <div className="flex flex-col h-full text-white px-24 py-20">
      <div className="flex items-center gap-4 mb-2">
        <Rocket className="w-10 h-10 text-amber-300" />
        <span className="text-[20px] text-amber-300 font-semibold uppercase tracking-widest">Pour les startups</span>
      </div>
      <h2 className="text-[52px] font-bold mb-4">Votre tremplin vers la croissance</h2>
      <div className="h-1 w-24 bg-amber-400 rounded-full mb-10" />

      <div className="grid grid-cols-3 gap-6 flex-1">
        {benefits.map((b) => (
          <div key={b.title} className="bg-white/10 backdrop-blur rounded-2xl p-8 flex flex-col">
            <b.icon className="w-12 h-12 text-amber-300 mb-5" />
            <h3 className="text-[26px] font-bold mb-3">{b.title}</h3>
            <p className="text-[20px] text-white/70 leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

export default StartupSlide;
