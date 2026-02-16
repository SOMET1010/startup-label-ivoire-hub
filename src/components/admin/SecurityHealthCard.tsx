import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShieldAlert, ExternalLink, CheckCircle2, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface SecurityCheck {
  label: string;
  status: "ok" | "warn" | "action_required";
  description: string;
  remediation?: string;
}

const SECURITY_CHECKS: SecurityCheck[] = [
  {
    label: "Protection mots de passe compromis (HIBP)",
    status: "action_required",
    description:
      "Valide les mots de passe contre la base Have I Been Pwned pour rejeter les identifiants connus comme compromis.",
    remediation:
      "Cloud → Users → Auth settings → Email → Activer « Password HIBP Check » → Enregistrer.",
  },
  {
    label: "Row Level Security (RLS)",
    status: "ok",
    description: "Toutes les tables publiques ont des politiques RLS actives.",
  },
  {
    label: "Authentification email",
    status: "ok",
    description: "Confirmation par email activée pour les inscriptions.",
  },
];

function statusIcon(status: SecurityCheck["status"]) {
  switch (status) {
    case "ok":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case "warn":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case "action_required":
      return <ShieldAlert className="h-4 w-4 text-destructive" />;
  }
}

function statusBadge(status: SecurityCheck["status"]) {
  switch (status) {
    case "ok":
      return <Badge variant="outline" className="border-green-300 text-green-700 dark:border-green-700 dark:text-green-400 text-[10px]">OK</Badge>;
    case "warn":
      return <Badge variant="outline" className="border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400 text-[10px]">Attention</Badge>;
    case "action_required":
      return <Badge variant="destructive" className="text-[10px]">Action requise</Badge>;
  }
}

export default function SecurityHealthCard() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const allOk = SECURITY_CHECKS.every((c) => c.status === "ok");
  const actionCount = SECURITY_CHECKS.filter((c) => c.status !== "ok").length;

  return (
    <Card className={allOk ? "border-green-200 dark:border-green-900" : "border-destructive/40"}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {allOk ? (
              <ShieldCheck className="h-5 w-5 text-green-600" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-destructive" />
            )}
            <CardTitle className="text-base">Santé sécurité</CardTitle>
          </div>
          {allOk ? (
            <Badge variant="outline" className="border-green-300 text-green-700 dark:border-green-700 dark:text-green-400">
              Tout est en ordre
            </Badge>
          ) : (
            <Badge variant="destructive">
              {actionCount} action{actionCount > 1 ? "s" : ""} requise{actionCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {SECURITY_CHECKS.map((check) => (
          <div
            key={check.label}
            className="rounded-md border p-3 space-y-2 transition-colors hover:bg-muted/40 cursor-pointer"
            onClick={() => setExpanded(expanded === check.label ? null : check.label)}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {statusIcon(check.status)}
                <span className="text-sm font-medium truncate">{check.label}</span>
              </div>
              {statusBadge(check.status)}
            </div>

            {expanded === check.label && (
              <div className="text-xs text-muted-foreground space-y-2 pl-6">
                <p>{check.description}</p>
                {check.remediation && (
                  <div className="rounded bg-muted p-2 space-y-1.5">
                    <p className="font-medium text-foreground">Étapes de remédiation :</p>
                    <p>{check.remediation}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs mt-1"
                      asChild
                    >
                      <a href="/documents/enable-leaked-password-protection.md" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Guide complet
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
