import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListChecks, ArrowRight, AlertCircle, FileText, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { normalizeStatus, ApplicationStatus } from "@/components/shared/StatusBadge";

interface Action {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  href: string;
}

interface NextActionsCardProps {
  status: string | null | undefined;
  hasIncompleteDocuments?: boolean;
  hasUnreadComments?: boolean;
  className?: string;
}

export function NextActionsCard({
  status,
  hasIncompleteDocuments = false,
  hasUnreadComments = false,
  className,
}: NextActionsCardProps) {
  const normalizedStatus = normalizeStatus(status);

  // Générer les actions basées sur le statut
  const getActions = (): Action[] => {
    const actions: Action[] = [];

    switch (normalizedStatus) {
      case "draft":
      case "incomplete":
        if (hasIncompleteDocuments) {
          actions.push({
            id: "documents",
            title: "Compléter les documents",
            description: "Téléversez les documents requis",
            priority: "high",
            href: "/postuler",
          });
        }
        actions.push({
          id: "submit",
          title: "Finaliser la candidature",
          description: "Soumettez votre dossier pour examen",
          priority: "high",
          href: "/postuler",
        });
        break;

      case "pending":
        actions.push({
          id: "wait",
          title: "Dossier en attente de vérification",
          description: "Notre équipe examine votre dossier",
          priority: "low",
          href: "/startup/suivi",
        });
        break;

      case "verification":
      case "under_review":
        if (hasUnreadComments) {
          actions.push({
            id: "comments",
            title: "Répondre aux commentaires",
            description: "Le comité a laissé des remarques",
            priority: "high",
            href: "/startup/suivi",
          });
        }
        actions.push({
          id: "wait-eval",
          title: "Évaluation en cours",
          description: "Votre dossier est en cours d'examen",
          priority: "low",
          href: "/startup/suivi",
        });
        break;

      case "approved":
        actions.push({
          id: "explore",
          title: "Découvrir les avantages",
          description: "Accédez à l'espace labellisé",
          priority: "medium",
          href: "/startup/label-space",
        });
        break;

      case "rejected":
        actions.push({
          id: "feedback",
          title: "Consulter le retour du comité",
          description: "Comprenez les raisons du refus",
          priority: "high",
          href: "/startup/suivi",
        });
        break;

      case "expired":
        actions.push({
          id: "renew",
          title: "Renouveler le label",
          description: "Votre label a expiré",
          priority: "high",
          href: "/startup/renouvellement",
        });
        break;

      default:
        actions.push({
          id: "start",
          title: "Démarrer votre candidature",
          description: "Créez votre dossier de candidature",
          priority: "high",
          href: "/postuler",
        });
    }

    return actions;
  };

  const actions = getActions();
  const highPriorityCount = actions.filter((a) => a.priority === "high").length;

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-3 w-3 text-accent" />;
      case "medium":
        return <FileText className="h-3 w-3 text-primary" />;
      default:
        return <Upload className="h-3 w-3 text-muted-foreground" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <Card className={cn("h-full flex flex-col", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-accent/10">
              <ListChecks className="h-4 w-4 text-accent" />
            </div>
            Prochaines actions attendues
            {highPriorityCount > 0 && (
              <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-accent/20 text-accent rounded-full">
                {highPriorityCount}
              </span>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 space-y-3">
            {actions.map((action, index) => (
              <div
                key={action.id}
                className={cn(
                  "p-3 rounded-lg border transition-colors",
                  action.priority === "high"
                    ? "bg-accent/5 border-accent/20"
                    : "bg-muted/30 border-transparent"
                )}
              >
                <div className="flex items-start gap-2">
                  <div
                    className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold mt-0.5",
                      action.priority === "high"
                        ? "bg-accent/20 text-accent"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                  {getPriorityIcon(action.priority)}
                </div>
              </div>
            ))}
          </div>

          {actions[0]?.priority === "high" && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="mt-4 w-full justify-center text-accent hover:text-accent hover:bg-accent/10"
            >
              <Link to={actions[0].href}>
                Compléter le dossier
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default NextActionsCard;
