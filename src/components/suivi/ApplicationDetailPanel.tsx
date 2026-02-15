import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { StatusActionCard, StatusQuickActions } from "@/components/suivi/StatusActionCard";
import { ProcessTimeline } from "@/components/suivi/ProcessTimeline";
import { ApplicationWithDetails, STATUS_CONFIG, generateTrackingId } from "@/hooks/useApplicationTracking";
import { SECTOR_LABELS, STAGE_LABELS } from "@/lib/constants/startup";
import {
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Building,
  Calendar,
  Users,
  Globe,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock className="h-5 w-5 text-yellow-500" />,
  under_review: <FileText className="h-5 w-5 text-blue-500" />,
  approved: <CheckCircle className="h-5 w-5 text-green-500" />,
  rejected: <XCircle className="h-5 w-5 text-red-500" />,
};

interface ApplicationDetailPanelProps {
  selectedApp: ApplicationWithDetails | null;
}

export default function ApplicationDetailPanel({ selectedApp }: ApplicationDetailPanelProps) {
  if (!selectedApp) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-muted-foreground">
            Sélectionnez une candidature pour voir les détails.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <StatusActionCard 
        status={selectedApp.application.status}
        hasUnreadComments={selectedApp.comments.length > 0 && selectedApp.application.status === 'under_review'}
      />
      <StatusQuickActions status={selectedApp.application.status} />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{selectedApp.startup.name}</CardTitle>
              <CardDescription>
                Dossier N° {generateTrackingId(selectedApp.application.id, selectedApp.application.created_at)}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {STATUS_ICONS[selectedApp.application.status]}
              <Badge variant={STATUS_CONFIG[selectedApp.application.status]?.variant || "secondary"}>
                {STATUS_CONFIG[selectedApp.application.status]?.label || selectedApp.application.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="font-medium">Progression de votre dossier</h3>
            <ProcessTimeline 
              currentStatus={selectedApp.application.status}
              submittedAt={selectedApp.application.submitted_at}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Informations</TabsTrigger>
          <TabsTrigger value="comments">
            Commentaires ({selectedApp.comments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations de la startup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Secteur</p>
                    <p className="font-medium">
                      {SECTOR_LABELS[selectedApp.startup.sector || ""] || selectedApp.startup.sector || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Stade</p>
                    <p className="font-medium">
                      {STAGE_LABELS[selectedApp.startup.stage || ""] || selectedApp.startup.stage || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Équipe</p>
                    <p className="font-medium">
                      {selectedApp.startup.team_size || "-"} employés
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Création</p>
                    <p className="font-medium">
                      {selectedApp.startup.founded_date
                        ? format(new Date(selectedApp.startup.founded_date), "MMMM yyyy", { locale: fr })
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>

              {selectedApp.startup.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Site web</p>
                    <a
                      href={selectedApp.startup.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline"
                    >
                      {selectedApp.startup.website}
                    </a>
                  </div>
                </div>
              )}

              {selectedApp.startup.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-sm whitespace-pre-wrap">{selectedApp.startup.description}</p>
                </div>
              )}

              {selectedApp.application.notes && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Notes de l'évaluateur</p>
                  <p className="text-sm bg-muted p-3 rounded-lg">
                    {selectedApp.application.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Historique des commentaires</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedApp.comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Aucun commentaire pour le moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedApp.comments.map((comment) => (
                    <div key={comment.id} className="border-l-2 border-primary/30 pl-4 py-1">
                      <div className="flex justify-between">
                        <p className="font-medium">Évaluateur</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(comment.created_at), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                        </p>
                      </div>
                      <p className="text-muted-foreground mt-1">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
