import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CompletionDonut } from "./CompletionDonut";

interface Document {
  key: string;
  label: string;
  required: boolean;
  uploaded: boolean;
}

interface CompletionCardProps {
  documents: Document[];
  className?: string;
}

export function CompletionCard({ documents, className }: CompletionCardProps) {
  // Calculer le pourcentage de complétion
  const requiredDocs = documents.filter((d) => d.required);
  const uploadedRequired = requiredDocs.filter((d) => d.uploaded).length;
  const percentage = requiredDocs.length > 0 
    ? Math.round((uploadedRequired / requiredDocs.length) * 100)
    : 0;

  const missingDocs = documents.filter((d) => d.required && !d.uploaded);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
    >
      <Card className={cn("h-full flex flex-col", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <FolderOpen className="h-4 w-4 text-primary" />
            </div>
            Complétude du dossier
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col items-center">
          <CompletionDonut percentage={percentage} size={100} strokeWidth={8} />

          {missingDocs.length > 0 && (
            <div className="mt-4 w-full">
              <p className="text-xs text-muted-foreground mb-2">
                Documents manquants :
              </p>
              <ul className="space-y-1">
                {missingDocs.slice(0, 3).map((doc) => (
                  <li
                    key={doc.key}
                    className="text-xs text-foreground flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {doc.label}
                  </li>
                ))}
                {missingDocs.length > 3 && (
                  <li className="text-xs text-muted-foreground">
                    +{missingDocs.length - 3} autre{missingDocs.length > 4 ? "s" : ""}
                  </li>
                )}
              </ul>
            </div>
          )}

          {percentage < 100 && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="mt-4 w-full justify-center text-primary hover:text-primary hover:bg-primary/10"
            >
              <Link to="/postuler">
                Compléter
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          )}

          {percentage === 100 && (
            <p className="mt-4 text-xs text-success font-medium text-center">
              ✓ Dossier complet
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default CompletionCard;
