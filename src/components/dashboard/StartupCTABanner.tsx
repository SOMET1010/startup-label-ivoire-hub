import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Rocket, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StartupCTABannerProps {
  className?: string;
}

export function StartupCTABanner({ className }: StartupCTABannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className={cn(
        "rounded-xl border bg-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-accent/10">
          <Rocket className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Vous êtes une startup ?</h3>
          <p className="text-sm text-muted-foreground">
            Créez un compte pour déposer votre dossier de candidature au label.
          </p>
        </div>
      </div>

      <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0">
        <Link to="/postuler">
          Inscrire ma startup
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </Button>
    </motion.div>
  );
}

export default StartupCTABanner;
