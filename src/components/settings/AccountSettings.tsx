import { useState } from "react";
import { useTranslation } from "react-i18next";
import { User, Mail, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function AccountSettings() {
  const { t } = useTranslation('settings');
  const { t: tCommon } = useTranslation('common');
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, updated_at: new Date().toISOString() })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: t('messages.saved'),
        description: t('messages.savedDescription'),
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: t('messages.error'),
        description: t('messages.errorDescription'),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-muted-foreground" />
          {t('account.email')}
        </Label>
        <Input
          value={user?.email || ""}
          disabled
          className="max-w-md bg-muted"
        />
        <p className="text-sm text-muted-foreground">
          {t('account.emailReadonly')}
        </p>
      </div>

      <div className="space-y-3">
        <Label htmlFor="fullName" className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          {t('account.fullName')}
        </Label>
        <div className="flex gap-3 max-w-md">
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t('account.fullNamePlaceholder')}
          />
          <Button
            onClick={handleSave}
            disabled={isSaving || fullName === profile?.full_name}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {tCommon('actions.saving')}
              </>
            ) : (
              tCommon('actions.save')
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
