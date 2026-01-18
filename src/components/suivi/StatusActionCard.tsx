import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Clock, 
  FileUp, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  ArrowRight,
  AlertTriangle,
  FileCheck,
  Trophy,
  Gift
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonLabel: string;
  buttonVariant: 'default' | 'outline' | 'secondary' | 'destructive';
  action?: () => void;
  linkTo?: string;
  accent: 'warning' | 'info' | 'success' | 'danger' | 'muted';
}

const STATUS_ACTIONS: Record<string, StatusAction> = {
  draft: {
    title: "Dossier incomplet",
    description: "Complétez votre dossier pour soumettre votre candidature au comité de labellisation.",
    icon: <FileUp className="h-6 w-6" />,
    buttonLabel: "Compléter mon dossier",
    buttonVariant: "default",
    linkTo: "/postuler",
    accent: "warning"
  },
  pending: {
    title: "En attente de traitement",
    description: "Votre dossier a été reçu. Il sera examiné par notre équipe dans les 48-72h ouvrées.",
    icon: <Clock className="h-6 w-6" />,
    buttonLabel: "Voir les délais estimés",
    buttonVariant: "outline",
    accent: "info"
  },
  under_review: {
    title: "Examen en cours",
    description: "Les évaluateurs analysent votre dossier. Vous serez notifié si des informations complémentaires sont requises.",
    icon: <FileCheck className="h-6 w-6" />,
    buttonLabel: "Consulter les critères",
    buttonVariant: "outline",
    linkTo: "/criteres",
    accent: "info"
  },
  documents_required: {
    title: "Documents requis",
    description: "L'équipe a besoin de documents supplémentaires pour continuer l'évaluation de votre dossier.",
    icon: <AlertTriangle className="h-6 w-6" />,
    buttonLabel: "Téléverser les documents",
    buttonVariant: "default",
    linkTo: "/postuler",
    accent: "warning"
  },
  incomplete: {
    title: "Documents manquants",
    description: "Des documents supplémentaires ont été demandés pour compléter votre dossier de candidature.",
    icon: <FileUp className="h-6 w-6" />,
    buttonLabel: "Voir les documents requis",
    buttonVariant: "default",
    linkTo: "/suivi-candidature",
    accent: "warning"
  },
  info_requested: {
    title: "Informations demandées",
    description: "Un évaluateur vous a posé une question. Répondez pour débloquer l'examen de votre dossier.",
    icon: <MessageSquare className="h-6 w-6" />,
    buttonLabel: "Répondre à la question",
    buttonVariant: "default",
    accent: "warning"
  },
  committee_review: {
    title: "Comité de labellisation",
    description: "Votre dossier est présenté au comité. La décision sera communiquée sous 5 jours ouvrés.",
    icon: <RefreshCw className="h-6 w-6" />,
    buttonLabel: "En savoir plus sur le comité",
    buttonVariant: "outline",
    linkTo: "/criteres",
    accent: "info"
  },
  approved: {
    title: "🎉 Félicitations ! Label obtenu",
    description: "Votre startup est officiellement labellisée. Accédez à vos avantages exclusifs dès maintenant.",
    icon: <Trophy className="h-6 w-6" />,
    buttonLabel: "Découvrir mes avantages",
    buttonVariant: "default",
    linkTo: "/avantages",
    accent: "success"
  },
  rejected: {
    title: "Candidature non retenue",
    description: "Votre dossier ne remplit pas tous les critères. Consultez les motifs et préparez une nouvelle candidature.",
    icon: <XCircle className="h-6 w-6" />,
    buttonLabel: "Voir les motifs de refus",
    buttonVariant: "outline",
    accent: "danger"
  }
};

const ACCENT_STYLES = {
  warning: {
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    icon: 'text-warning',
    badge: 'badge-warning'
  },
  info: {
    bg: 'bg-info/10',
    border: 'border-info/30',
    icon: 'text-info',
    badge: 'badge-info'
  },
  success: {
    bg: 'bg-success/10',
    border: 'border-success/30',
    icon: 'text-success',
    badge: 'badge-success'
  },
  danger: {
    bg: 'bg-destructive/10',
    border: 'border-destructive/30',
    icon: 'text-destructive',
    badge: 'badge-danger'
  },
  muted: {
    bg: 'bg-muted/50',
    border: 'border-border',
    icon: 'text-muted-foreground',
    badge: ''
  }
};

interface StatusActionCardProps {
  status: string;
  onAction?: () => void;
  hasUnreadComments?: boolean;
  missingDocuments?: string[];
  className?: string;
}

export function StatusActionCard({ 
  status, 
  onAction,
  hasUnreadComments = false,
  missingDocuments = [],
  className 
}: StatusActionCardProps) {
  // Get action config or fallback to pending
  const actionConfig = STATUS_ACTIONS[status] || STATUS_ACTIONS.pending;
  const accentStyles = ACCENT_STYLES[actionConfig.accent];

  // Override for special cases
  const displayConfig = { ...actionConfig };
  
  if (hasUnreadComments && status !== 'approved' && status !== 'rejected') {
    displayConfig.title = "Nouveau commentaire reçu";
    displayConfig.description = "Un évaluateur a laissé un commentaire sur votre dossier. Consultez-le et répondez si nécessaire.";
    displayConfig.icon = <MessageSquare className="h-6 w-6" />;
    displayConfig.buttonLabel = "Lire le commentaire";
    displayConfig.buttonVariant = "default";
  }

  if (missingDocuments.length > 0) {
    displayConfig.title = "Documents manquants";
    displayConfig.description = `Veuillez téléverser: ${missingDocuments.join(', ')}`;
    displayConfig.icon = <AlertTriangle className="h-6 w-6" />;
    displayConfig.buttonLabel = "Ajouter les documents";
    displayConfig.buttonVariant = "default";
    displayConfig.linkTo = "/postuler";
  }

  const ButtonContent = (
    <>
      {displayConfig.buttonLabel}
      <ArrowRight className="h-4 w-4 ml-1" />
    </>
  );

  return (
    <Card className={cn(
      "border-2 transition-all duration-normal",
      accentStyles.border,
      accentStyles.bg,
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={cn(
            "flex-shrink-0 p-3 rounded-full",
            accentStyles.bg,
            accentStyles.icon
          )}>
            {displayConfig.icon}
          </div>

          {/* Content */}
          <div className="flex-grow min-w-0">
            <h3 className="font-semibold text-lg mb-1">{displayConfig.title}</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {displayConfig.description}
            </p>

            {/* Action Button */}
            {displayConfig.linkTo ? (
              <Button 
                variant={displayConfig.buttonVariant} 
                size="sm"
                asChild
              >
                <Link to={displayConfig.linkTo}>
                  {ButtonContent}
                </Link>
              </Button>
            ) : (
              <Button 
                variant={displayConfig.buttonVariant}
                size="sm"
                onClick={onAction || displayConfig.action}
              >
                {ButtonContent}
              </Button>
            )}
          </div>
        </div>

        {/* Additional context for approved status */}
        {status === 'approved' && (
          <div className="mt-4 pt-4 border-t border-success/20">
            <div className="flex items-center gap-2 text-sm text-success font-medium">
              <Gift className="h-4 w-4" />
              <span>3 avantages disponibles</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Quick actions for specific statuses
export function StatusQuickActions({ status }: { status: string }) {
  if (status === 'approved') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <QuickActionButton
          icon={<Gift className="h-5 w-5" />}
          label="Avantages fiscaux"
          href="/avantages"
        />
        <QuickActionButton
          icon={<Trophy className="h-5 w-5" />}
          label="Mon badge"
          href="/startup/badge"
        />
        <QuickActionButton
          icon={<FileCheck className="h-5 w-5" />}
          label="Attestation"
          href="/startup/attestation"
        />
        <QuickActionButton
          icon={<RefreshCw className="h-5 w-5" />}
          label="Renouveler"
          href="/startup/renouvellement"
        />
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="grid grid-cols-2 gap-3 mt-4">
        <QuickActionButton
          icon={<RefreshCw className="h-5 w-5" />}
          label="Nouvelle candidature"
          href="/postuler"
        />
        <QuickActionButton
          icon={<MessageSquare className="h-5 w-5" />}
          label="Contacter le support"
          href="/contact"
        />
      </div>
    );
  }

  return null;
}

function QuickActionButton({ 
  icon, 
  label, 
  href 
}: { 
  icon: React.ReactNode; 
  label: string; 
  href: string; 
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-auto py-3 flex-col gap-1"
      asChild
    >
      <Link to={href}>
        {icon}
        <span className="text-xs">{label}</span>
      </Link>
    </Button>
  );
}
