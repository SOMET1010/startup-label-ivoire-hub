import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Heart, Rocket, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInvestorData } from "@/hooks/useInvestorData";
import { SEOHead } from "@/components/shared/SEOHead";

const INTEREST_STATUSES = ["interested", "contacted", "meeting", "passed"] as const;

export default function InvestorInterests() {
  const { t } = useTranslation("dashboard");
  const { interests, interestsLoading, updateInterest, toggleInterest } = useInvestorData();
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState("");

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "contacted": return "default";
      case "meeting": return "success";
      case "passed": return "secondary";
      default: return "outline";
    }
  };

  const handleSaveNotes = (id: string) => {
    updateInterest.mutate({ id, notes: notesValue });
    setEditingNotes(null);
  };

  return (
    <>
      <SEOHead title={t("investor.interests.title")} description={t("investor.interests.subtitle")} />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t("investor.interests.title")}</h1>
          <p className="text-muted-foreground">{t("investor.interests.subtitle")}</p>
        </div>

        {interestsLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
        ) : interests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t("investor.interests.empty")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {interests.map((interest, i) => (
              <motion.div key={interest.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Rocket className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{interest.startup?.name || "—"}</h3>
                          <p className="text-sm text-muted-foreground">{interest.startup?.sector || "—"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Select
                          value={interest.status}
                          onValueChange={(value) => updateInterest.mutate({ id: interest.id, status: value })}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {INTEREST_STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {t(`investor.interests.status.${s}`)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleInterest.mutate(interest.startup_id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="mt-4">
                      {editingNotes === interest.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={notesValue}
                            onChange={(e) => setNotesValue(e.target.value)}
                            placeholder={t("investor.interests.notesPlaceholder")}
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleSaveNotes(interest.id)}>
                              {t("investor.interests.save")}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingNotes(null)}>
                              {t("investor.interests.cancel")}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingNotes(interest.id); setNotesValue(interest.notes || ""); }}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left"
                        >
                          {interest.notes || t("investor.interests.addNotes")}
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
