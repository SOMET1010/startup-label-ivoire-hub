import { ExternalLink } from "lucide-react";

const GovTopBar = () => {
  return (
    <div className="gov-topbar">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/images/armoiries-ci.svg" 
            alt="Armoiries de la Côte d'Ivoire" 
            className="h-6 w-auto"
          />
          <span className="font-medium text-sm">
            République de Côte d'Ivoire
          </span>
        </div>
        
        <a 
          href="https://www.gouv.ci" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm hover:underline opacity-90 hover:opacity-100 transition-opacity"
        >
          gouv.ci
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
};

export default GovTopBar;
