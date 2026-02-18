import { ChevronLeft, ChevronRight, Maximize, Minimize, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PresentationControlsProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const PresentationControls = ({
  current,
  total,
  onPrev,
  onNext,
  isFullscreen,
  onToggleFullscreen,
}: PresentationControlsProps) => {
  const navigate = useNavigate();

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-black/60 backdrop-blur-sm text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
      <button onClick={() => navigate("/")} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
        <Home className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-4">
        <button onClick={onPrev} disabled={current === 0} className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-30">
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-6 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>

        <span className="text-sm font-medium min-w-[60px] text-center">
          {current + 1} / {total}
        </span>

        <button onClick={onNext} disabled={current === total - 1} className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-30">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <button onClick={onToggleFullscreen} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
        {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default PresentationControls;
