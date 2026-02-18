import { ReactNode } from "react";

interface SlideLayoutProps {
  children: ReactNode;
  className?: string;
}

const SlideLayout = ({ children, className = "" }: SlideLayoutProps) => (
  <div
    className={`w-[1920px] h-[1080px] relative overflow-hidden ${className}`}
    style={{
      background: "linear-gradient(135deg, #004D25 0%, #006B35 30%, #008744 60%, #F57C00 100%)",
    }}
  >
    {/* Decorative circles */}
    <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-white/5" />
    <div className="absolute -bottom-60 -left-60 w-[800px] h-[800px] rounded-full bg-white/5" />
    {children}
  </div>
);

export default SlideLayout;
