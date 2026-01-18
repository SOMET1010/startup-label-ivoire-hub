import { ReactNode } from "react";

interface InstitutionalHeroProps {
  children: ReactNode;
  className?: string;
}

const InstitutionalHero = ({ children, className = "" }: InstitutionalHeroProps) => {
  return (
    <section className={`institutional-hero text-white py-16 md:py-24 ${className}`}>
      <div className="relative z-10 container mx-auto px-4">
        {children}
      </div>
    </section>
  );
};

export default InstitutionalHero;
