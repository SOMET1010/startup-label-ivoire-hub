import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStructureData } from "@/hooks/useStructureData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StructureProfilePage() {
  const { structure, updateStructure, isLoading } = useStructureData();
  const { t } = useTranslation("dashboard");
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "",
    location: "",
    website: "",
    focus_sectors: [] as string[],
  });

  useEffect(() => {
    if (structure) {
      setForm({
        name: structure.name || "",
        description: structure.description || "",
        type: structure.type || "",
        location: structure.location || "",
        website: structure.website || "",
        focus_sectors: structure.focus_sectors || [],
      });
    }
  }, [structure]);

  const handleSave = async () => {
    setSaving(true);
    const result = await updateStructure(form);
    setSaving(false);
    if (!result?.error) {
      toast({ title: t("structure.profile.saved") });
    } else {
      toast({ title: t("structure.profile.error"), variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {t("structure.profile.title")}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {t("structure.profile.cardTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t("structure.profile.form.name")}</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label>{t("structure.profile.form.type")}</Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm({ ...form, type: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("structure.profile.form.typePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="incubateur">Incubateur</SelectItem>
                  <SelectItem value="accelerateur">Accélérateur</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>{t("structure.profile.form.description")}</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t("structure.profile.form.location")}</Label>
              <Input
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
              />
            </div>
            <div>
              <Label>{t("structure.profile.form.website")}</Label>
              <Input
                value={form.website}
                onChange={(e) =>
                  setForm({ ...form, website: e.target.value })
                }
                placeholder="https://"
              />
            </div>
          </div>

          <div>
            <Label>{t("structure.profile.form.sectors")}</Label>
            <Input
              value={form.focus_sectors.join(", ")}
              onChange={(e) =>
                setForm({
                  ...form,
                  focus_sectors: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              placeholder={t("structure.profile.form.sectorsPlaceholder")}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t("structure.profile.form.sectorsHint")}
            </p>
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {t("structure.profile.form.save")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
