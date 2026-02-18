import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SlideRenderer from "@/components/presentation/SlideRenderer";
import PresentationControls from "@/components/presentation/PresentationControls";
import TitleSlide from "@/components/presentation/slides/TitleSlide";
import ContextSlide from "@/components/presentation/slides/ContextSlide";
import VisionSlide from "@/components/presentation/slides/VisionSlide";
import PortailSlide from "@/components/presentation/slides/PortailSlide";
import StartupSlide from "@/components/presentation/slides/StartupSlide";
import EvaluateurSlide from "@/components/presentation/slides/EvaluateurSlide";
import AdminSlide from "@/components/presentation/slides/AdminSlide";
import SAEInvestorSlide from "@/components/presentation/slides/SAEInvestorSlide";
import ArchitectureSlide from "@/components/presentation/slides/ArchitectureSlide";
import SecuritySlide from "@/components/presentation/slides/SecuritySlide";
import PlanningSlide from "@/components/presentation/slides/PlanningSlide";
import MerciSlide from "@/components/presentation/slides/MerciSlide";

const slides = [
  TitleSlide, ContextSlide, VisionSlide, PortailSlide,
  StartupSlide, EvaluateurSlide, AdminSlide, SAEInvestorSlide,
  ArchitectureSlide, SecuritySlide, PlanningSlide, MerciSlide,
];

const Presentation = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const go = useCallback((delta: number) => {
    setCurrent((prev) => {
      const next = prev + delta;
      if (next < 0 || next >= slides.length) return prev;
      setDirection(delta);
      return next;
    });
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      if (e.key === "Escape" && isFullscreen) document.exitFullscreen?.();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go, isFullscreen]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const SlideComponent = slides[current];

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black z-[100]">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, x: direction >= 0 ? 60 : -60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction >= 0 ? -60 : 60 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <SlideRenderer>
            <SlideComponent />
          </SlideRenderer>
        </motion.div>
      </AnimatePresence>

      <PresentationControls
        current={current}
        total={slides.length}
        onPrev={() => go(-1)}
        onNext={() => go(1)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />
    </div>
  );
};

export default Presentation;
