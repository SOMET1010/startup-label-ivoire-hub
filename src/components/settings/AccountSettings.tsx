import { useState } from "react";
import { User, Mail, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function AccountSettings() {
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
        title: "Profil mis à jour",
        description: "Votre nom a été enregistré avec succès.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil.",
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
          Adresse email
        </Label>
        <Input
          value={user?.email || ""}
          disabled
          className="max-w-md bg-muted"
        />
        <p className="text-sm text-muted-foreground">
          L'adresse email ne peut pas être modifiée.
        </p>
      </div>

      <div className="space-y-3">
        <Label htmlFor="fullName" className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          Nom complet
        </Label>
        <div className="flex gap-3 max-w-md">
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Votre nom complet"
          />
          <Button
            onClick={handleSave}
            disabled={isSaving || fullName === profile?.full_name}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
