import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApplicationWithDetails, STATUS_CONFIG, generateTrackingId } from "@/hooks/useApplicationTracking";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ApplicationsListProps {
  applications: ApplicationWithDetails[];
  selectedApp: ApplicationWithDetails | null;
  onSelect: (app: ApplicationWithDetails) => void;
}

export default function ApplicationsList({ applications, selectedApp, onSelect }: ApplicationsListProps) {
  return (
    <div className="lg:col-span-1 space-y-3">
      <h2 className="text-lg font-semibold mb-3">Mes candidatures</h2>
      {applications.map((app) => (
        <Card
          key={app.application.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedApp?.application.id === app.application.id
              ? "ring-2 ring-primary"
              : ""
          }`}
          onClick={() => onSelect(app)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium truncate">{app.startup.name}</h3>
              <Badge variant={STATUS_CONFIG[app.application.status]?.variant || "secondary"}>
                {STATUS_CONFIG[app.application.status]?.label || app.application.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {generateTrackingId(app.application.id, app.application.created_at)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Soumis le{" "}
              {app.application.submitted_at
                ? format(new Date(app.application.submitted_at), "dd MMM yyyy", { locale: fr })
                : format(new Date(app.application.created_at), "dd MMM yyyy", { locale: fr })}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
