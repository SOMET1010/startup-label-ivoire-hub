import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Users, Plus, Pencil, Trash2, Loader2, Upload,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type CommitteeMember = Tables<"committee_members">;

const ROLE_LABELS: Record<string, string> = {
  president: "Président",
  "vice-president": "Vice-Président",
  secretaire: "Secrétaire",
  membre: "Membre",
};

const EMPTY_FORM = {
  full_name: "",
  title: "",
  organization: "",
  role_in_committee: "membre",
  bio: "",
  display_order: 0,
  is_active: true,
};

export default function AdminCommitteeMembers() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<CommitteeMember | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["committee-members"],
    queryFn: async () => {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from("committee_members")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as CommitteeMember[];
    },
  });

  const openCreateDialog = () => {
    setEditingMember(null);
    setForm(EMPTY_FORM);
    setPhotoFile(null);
    setDialogOpen(true);
  };

  const openEditDialog = (member: CommitteeMember) => {
    setEditingMember(member);
    setForm({
      full_name: member.full_name,
      title: member.title || "",
      organization: member.organization || "",
      role_in_committee: member.role_in_committee,
      bio: member.bio || "",
      display_order: member.display_order ?? 0,
      is_active: member.is_active ?? true,
    });
    setPhotoFile(null);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!supabase || !form.full_name.trim()) return;
    setSaving(true);

    try {
      let photoUrl = editingMember?.photo_url || null;

      // Upload photo if provided
      if (photoFile) {
        const timestamp = Date.now();
        const safeName = photoFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `photos/${timestamp}_${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("committee-photos")
          .upload(path, photoFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("committee-photos")
          .getPublicUrl(path);

        photoUrl = urlData.publicUrl;
      }

      const payload = {
        full_name: form.full_name.trim(),
        title: form.title.trim() || null,
        organization: form.organization.trim() || null,
        role_in_committee: form.role_in_committee,
        bio: form.bio.trim() || null,
        photo_url: photoUrl,
        display_order: form.display_order,
        is_active: form.is_active,
      };

      if (editingMember) {
        const { error } = await supabase
          .from("committee_members")
          .update(payload)
          .eq("id", editingMember.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("committee_members")
          .insert(payload);
        if (error) throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ["committee-members"] });
      setDialogOpen(false);
      toast({
        title: editingMember ? "Membre modifié" : "Membre ajouté",
        description: `${form.full_name} a été ${editingMember ? "mis à jour" : "ajouté"} avec succès.`,
      });
    } catch (error: unknown) {
      console.error("Error saving committee member:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer le membre.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!supabase || !memberToDelete) return;
    setDeleting(true);

    try {
      // Delete photo from storage if it exists
      if (memberToDelete.photo_url) {
        const url = new URL(memberToDelete.photo_url);
        const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/committee-photos\/(.+)/);
        if (pathMatch) {
          await supabase.storage.from("committee-photos").remove([pathMatch[1]]);
        }
      }

      const { error } = await supabase
        .from("committee_members")
        .delete()
        .eq("id", memberToDelete.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["committee-members"] });
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
      toast({
        title: "Membre supprimé",
        description: `${memberToDelete.full_name} a été retiré du comité.`,
      });
    } catch (error: unknown) {
      console.error("Error deleting committee member:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le membre.",
      });
    } finally {
      setDeleting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Membres du comité</CardTitle>
              <CardDescription>Gérez les membres du comité de labellisation.</CardDescription>
            </div>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : members.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Aucun membre du comité.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <Card key={member.id} className="relative">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={member.photo_url || undefined} alt={member.full_name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(member.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{member.full_name}</h4>
                      {member.title && (
                        <p className="text-sm text-muted-foreground truncate">{member.title}</p>
                      )}
                      {member.organization && (
                        <p className="text-xs text-muted-foreground truncate">{member.organization}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {ROLE_LABELS[member.role_in_committee] || member.role_in_committee}
                        </Badge>
                        {!member.is_active && (
                          <Badge variant="secondary" className="text-xs">Inactif</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-4 border-t pt-3">
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(member)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        setMemberToDelete(member);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMember ? "Modifier le membre" : "Nouveau membre du comité"}</DialogTitle>
            <DialogDescription>
              {editingMember
                ? "Modifiez les informations du membre."
                : "Ajoutez un nouveau membre au comité de labellisation."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="member-name">Nom complet *</Label>
              <Input
                id="member-name"
                value={form.full_name}
                onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
                placeholder="Dr. Jean Dupont"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="member-title">Titre / Fonction</Label>
                <Input
                  id="member-title"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Directeur général"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="member-org">Organisation</Label>
                <Input
                  id="member-org"
                  value={form.organization}
                  onChange={(e) => setForm((p) => ({ ...p, organization: e.target.value }))}
                  placeholder="Ministère..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rôle dans le comité</Label>
                <Select
                  value={form.role_in_committee}
                  onValueChange={(v) => setForm((p) => ({ ...p, role_in_committee: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="president">Président</SelectItem>
                    <SelectItem value="vice-president">Vice-Président</SelectItem>
                    <SelectItem value="secretaire">Secrétaire</SelectItem>
                    <SelectItem value="membre">Membre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="member-order">Ordre d'affichage</Label>
                <Input
                  id="member-order"
                  type="number"
                  value={form.display_order}
                  onChange={(e) => setForm((p) => ({ ...p, display_order: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="member-bio">Biographie</Label>
              <Textarea
                id="member-bio"
                value={form.bio}
                onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                placeholder="Parcours et expertise..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="member-photo">Photo</Label>
              <div className="flex items-center gap-3">
                {(editingMember?.photo_url || photoFile) && (
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={photoFile ? URL.createObjectURL(photoFile) : editingMember?.photo_url || undefined}
                    />
                    <AvatarFallback>{form.full_name ? getInitials(form.full_name) : "?"}</AvatarFallback>
                  </Avatar>
                )}
                <Input
                  id="member-photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                />
              </div>
              {photoFile && (
                <Badge variant="outline" className="text-xs">
                  <Upload className="h-3 w-3 mr-1" />
                  {photoFile.name}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="member-active"
                checked={form.is_active}
                onCheckedChange={(checked) => setForm((p) => ({ ...p, is_active: checked }))}
              />
              <Label htmlFor="member-active">Membre actif</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={saving || !form.full_name.trim()}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {editingMember ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Retirer ce membre ?</AlertDialogTitle>
            <AlertDialogDescription>
              {memberToDelete?.full_name} sera définitivement retiré du comité.
              {memberToDelete?.photo_url && " Sa photo sera aussi supprimée du stockage."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
