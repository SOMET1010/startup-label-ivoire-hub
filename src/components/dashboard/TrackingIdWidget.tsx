import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hash, Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TrackingIdWidgetProps {
  applicationId: string;
  className?: string;
}

export function TrackingIdWidget({ applicationId, className }: TrackingIdWidgetProps) {
  const [copied, setCopied] = useState(false);
  
  const trackingId = applicationId.substring(0, 8).toUpperCase();
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(trackingId);
      setCopied(true);
      toast({
        title: "Numéro copié",
        description: "Le numéro de suivi a été copié dans le presse-papier.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de copier le numéro.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={`border-primary/20 bg-primary/5 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Hash className="h-4 w-4 text-primary" />
          </div>
          Numéro de suivi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">
              Conservez ce numéro pour suivre votre candidature
            </p>
            <code className="text-lg font-mono font-bold text-primary bg-primary/10 px-3 py-1.5 rounded inline-block">
              {trackingId}
            </code>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2 flex-shrink-0"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                Copié
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copier
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
