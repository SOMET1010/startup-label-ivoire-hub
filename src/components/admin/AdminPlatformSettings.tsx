import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Building } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePlatformSettings, type PlatformSettings } from "@/hooks/usePlatformSettings";
import { useQueryClient } from "@tanstack/react-query";

const FIELDS: { key: string; label: string; type?: string; placeholder?: string }[] = [
  { key: "ministry_name", label: "Nom du ministère", placeholder: "Ministère de la..." },
  { key: "ministry_acronym", label: "Acronyme", placeholder: "MTNI" },
  { key: "minister_title", label: "Titre du ministre", placeholder: "Ministre de..." },
  { key: "ministry_address", label: "Adresse", placeholder: "Abidjan, Plateau..." },
  { key: "ministry_phone", label: "Téléphone", type: "tel", placeholder: "+225 27 22 XX XX XX" },
  { key: "ministry_email", label: "Email du ministère", type: "email", placeholder: "contact@mtni.gouv.ci" },
  { key: "ministry_website", label: "Site web du ministère", type: "url", placeholder: "https://www.mtni.gouv.ci" },
  { key: "platform_name", label: "Nom de la plateforme", placeholder: "Ivoire Hub" },
  { key: "platform_email", label: "Email de la plateforme", type: "email", placeholder: "contact@ivoirehub.ci" },
];

export default function AdminPlatformSettings() {
  const { settings, isLoading } = usePlatformSettings();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<PlatformSettings>(settings);
  const [saving, setSaving] = useState(false);

  // Sync form when settings load
  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!supabase) return;
    setSaving(true);

    try {
      // Upsert each key/value pair
      const entries = FIELDS.map((f) => ({
        key: f.key,
        value: form[f.key] || "",
      }));

      for (const entry of entries) {
        const { error } = await supabase
          .from("platform_settings")
          .upsert({ key: entry.key, value: entry.value }, { onConflict: "key" });

        if (error) throw error;
      }

      // Invalidate cache so changes propagate everywhere
      await queryClient.invalidateQueries({ queryKey: ["platform-settings"] });

      toast({
        title: "Paramètres enregistrés",
        description: "Les modifications ont été sauvegardées avec succès.",
      });
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer les paramètres.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          <CardTitle>Paramètres de la plateforme</CardTitle>
        </div>
        <CardDescription>
          Modifiez les informations institutionnelles affichées sur le site (pied de page, mentions légales, etc.)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FIELDS.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input
                id={field.key}
                type={field.type || "text"}
                placeholder={field.placeholder}
                value={form[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-8">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Enregistrer les paramètres
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
