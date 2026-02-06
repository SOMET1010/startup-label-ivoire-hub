import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Save } from "lucide-react";
import { useInvestorData } from "@/hooks/useInvestorData";
import { SEOHead } from "@/components/shared/SEOHead";

const INVESTOR_TYPES = ["Business Angel", "VC", "Corporate", "Fonds public", "Family Office"];
const INVESTMENT_STAGES = ["Pré-seed", "Seed", "Série A", "Série B", "Série C+", "Growth"];

export default function InvestorProfile() {
  const { t } = useTranslation("dashboard");
  const { investor, investorLoading, updateProfile } = useInvestorData();

  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "",
    investment_stages: [] as string[],
    ticket_min: "",
    ticket_max: "",
    target_sectors: "",
    location: "",
    website: "",
  });

  useEffect(() => {
    if (investor) {
      setForm({
        name: investor.name || "",
        description: investor.description || "",
        type: investor.type || "",
        investment_stages: investor.investment_stages || [],
        ticket_min: investor.ticket_min?.toString() || "",
        ticket_max: investor.ticket_max?.toString() || "",
        target_sectors: (investor.target_sectors || []).join(", "),
        location: investor.location || "",
        website: investor.website || "",
      });
    }
  }, [investor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({
      name: form.name,
      description: form.description || null,
      type: form.type || null,
      investment_stages: form.investment_stages.length > 0 ? form.investment_stages : null,
      ticket_min: form.ticket_min ? parseInt(form.ticket_min) : null,
      ticket_max: form.ticket_max ? parseInt(form.ticket_max) : null,
      target_sectors: form.target_sectors ? form.target_sectors.split(",").map((s) => s.trim()).filter(Boolean) : null,
      location: form.location || null,
      website: form.website || null,
    });
  };

  const toggleStage = (stage: string) => {
    setForm((prev) => ({
      ...prev,
      investment_stages: prev.investment_stages.includes(stage)
        ? prev.investment_stages.filter((s) => s !== stage)
        : [...prev.investment_stages, stage],
    }));
  };

  if (investorLoading) {
    return <div className="space-y-4"><Skeleton className="h-96" /></div>;
  }

  return (
    <>
      <SEOHead title={t("investor.profile.title")} description={t("investor.profile.subtitle")} />
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">{t("investor.profile.title")}</h1>
          <p className="text-muted-foreground">{t("investor.profile.subtitle")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("investor.profile.cardTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label>{t("investor.profile.form.name")}</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>

              <div className="space-y-2">
                <Label>{t("investor.profile.form.description")}</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
              </div>

              <div className="space-y-2">
                <Label>{t("investor.profile.form.type")}</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("investor.profile.form.typePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {INVESTOR_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("investor.profile.form.stages")}</Label>
                <div className="flex flex-wrap gap-2">
                  {INVESTMENT_STAGES.map((stage) => (
                    <Button
                      key={stage}
                      type="button"
                      variant={form.investment_stages.includes(stage) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleStage(stage)}
                    >
                      {stage}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("investor.profile.form.ticketMin")}</Label>
                  <Input type="number" value={form.ticket_min} onChange={(e) => setForm({ ...form, ticket_min: e.target.value })} placeholder="FCFA" />
                </div>
                <div className="space-y-2">
                  <Label>{t("investor.profile.form.ticketMax")}</Label>
                  <Input type="number" value={form.ticket_max} onChange={(e) => setForm({ ...form, ticket_max: e.target.value })} placeholder="FCFA" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("investor.profile.form.sectors")}</Label>
                <Input
                  value={form.target_sectors}
                  onChange={(e) => setForm({ ...form, target_sectors: e.target.value })}
                  placeholder={t("investor.profile.form.sectorsPlaceholder")}
                />
                <p className="text-xs text-muted-foreground">{t("investor.profile.form.sectorsHint")}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("investor.profile.form.location")}</Label>
                  <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>{t("investor.profile.form.website")}</Label>
                  <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} type="url" />
                </div>
              </div>

              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {t("investor.profile.form.save")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
