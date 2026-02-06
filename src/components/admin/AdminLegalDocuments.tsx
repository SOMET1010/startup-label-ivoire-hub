import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
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
  FileText, Plus, Pencil, Trash2, Loader2, Upload, ExternalLink, Search, X,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Tables } from "@/integrations/supabase/types";

type LegalDocument = Tables<"legal_documents">;

const DOC_TYPE_LABELS: Record<string, string> = {
  loi: "Loi",
  decret: "Décret",
  arrete: "Arrêté",
  circulaire: "Circulaire",
};

const EMPTY_FORM = {
  title: "",
  description: "",
  document_type: "loi",
  official_number: "",
  published_date: "",
  external_url: "",
  display_order: 0,
  is_active: true,
};

export default function AdminLegalDocuments() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<LegalDocument | null>(null);
  const [docToDelete, setDocToDelete] = useState<LegalDocument | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["legal-documents"],
    queryFn: async () => {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from("legal_documents")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as LegalDocument[];
    },
  });

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = doc.title.toLowerCase().includes(q);
        const matchesNumber = doc.official_number?.toLowerCase().includes(q);
        const matchesDesc = doc.description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesNumber && !matchesDesc) return false;
      }
      if (typeFilter !== "all" && doc.document_type !== typeFilter) return false;
      if (statusFilter === "active" && !doc.is_active) return false;
      if (statusFilter === "inactive" && doc.is_active) return false;
      return true;
    });
  }, [documents, searchQuery, typeFilter, statusFilter]);

  const openCreateDialog = () => {
    setEditingDoc(null);
    setForm(EMPTY_FORM);
    setFile(null);
    setDialogOpen(true);
  };

  const openEditDialog = (doc: LegalDocument) => {
    setEditingDoc(doc);
    setForm({
      title: doc.title,
      description: doc.description || "",
      document_type: doc.document_type,
      official_number: doc.official_number || "",
      published_date: doc.published_date || "",
      external_url: doc.external_url || "",
      display_order: doc.display_order ?? 0,
      is_active: doc.is_active ?? true,
    });
    setFile(null);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!supabase || !form.title.trim()) return;
    setSaving(true);

    try {
      let fileUrl = editingDoc?.file_url || null;

      // Upload PDF if provided
      if (file) {
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `documents/${timestamp}_${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("legal-documents")
          .upload(path, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("legal-documents")
          .getPublicUrl(path);

        fileUrl = urlData.publicUrl;
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        document_type: form.document_type,
        official_number: form.official_number.trim() || null,
        published_date: form.published_date || null,
        external_url: form.external_url.trim() || null,
        file_url: fileUrl,
        display_order: form.display_order,
        is_active: form.is_active,
      };

      if (editingDoc) {
        const { error } = await supabase
          .from("legal_documents")
          .update(payload)
          .eq("id", editingDoc.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("legal_documents")
          .insert(payload);
        if (error) throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ["legal-documents"] });
      setDialogOpen(false);
      toast({
        title: editingDoc ? "Document modifié" : "Document ajouté",
        description: `"${form.title}" a été ${editingDoc ? "mis à jour" : "créé"} avec succès.`,
      });
    } catch (error: any) {
      console.error("Error saving legal document:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer le document.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!supabase || !docToDelete) return;
    setDeleting(true);

    try {
      // Delete file from storage if it exists
      if (docToDelete.file_url) {
        const url = new URL(docToDelete.file_url);
        const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/legal-documents\/(.+)/);
        if (pathMatch) {
          await supabase.storage.from("legal-documents").remove([pathMatch[1]]);
        }
      }

      const { error } = await supabase
        .from("legal_documents")
        .delete()
        .eq("id", docToDelete.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["legal-documents"] });
      setDeleteDialogOpen(false);
      setDocToDelete(null);
      toast({
        title: "Document supprimé",
        description: `"${docToDelete.title}" a été supprimé.`,
      });
    } catch (error: any) {
      console.error("Error deleting legal document:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le document.",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Documents juridiques</CardTitle>
              <CardDescription>Gérez les lois, décrets et arrêtés du cadre juridique.</CardDescription>
            </div>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par titre, n° officiel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="loi">Loi</SelectItem>
              <SelectItem value="decret">Décret</SelectItem>
              <SelectItem value="arrete">Arrêté</SelectItem>
              <SelectItem value="circulaire">Circulaire</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="active">Actifs</SelectItem>
              <SelectItem value="inactive">Inactifs</SelectItem>
            </SelectContent>
          </Select>
          {(searchQuery || typeFilter !== "all" || statusFilter !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setTypeFilter("all");
                setStatusFilter("all");
              }}
              className="whitespace-nowrap"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Réinitialiser
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {documents.length === 0
                ? "Aucun document juridique."
                : `Aucun résultat pour les filtres appliqués (${documents.length} document${documents.length > 1 ? "s" : ""} au total).`}
            </p>
          </div>
        ) : (
          <>
            {documents.length !== filteredDocuments.length && (
              <p className="text-sm text-muted-foreground mb-2">
                {filteredDocuments.length} sur {documents.length} document{documents.length > 1 ? "s" : ""}
              </p>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>N° officiel</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium max-w-[250px] truncate">{doc.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{DOC_TYPE_LABELS[doc.document_type] || doc.document_type}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{doc.official_number || "-"}</TableCell>
                    <TableCell>
                      {doc.published_date
                        ? format(new Date(doc.published_date), "dd MMM yyyy", { locale: fr })
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={doc.is_active ? "default" : "secondary"}>
                        {doc.is_active ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {(doc.file_url || doc.external_url) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <a
                              href={doc.file_url || doc.external_url || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(doc)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            setDocToDelete(doc);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDoc ? "Modifier le document" : "Nouveau document juridique"}</DialogTitle>
            <DialogDescription>
              {editingDoc ? "Modifiez les informations du document." : "Ajoutez un nouveau texte au cadre juridique."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doc-title">Titre *</Label>
              <Input
                id="doc-title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Loi n° 2023-XXX relative à..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doc-desc">Description</Label>
              <Textarea
                id="doc-desc"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Résumé du texte..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type de document</Label>
                <Select
                  value={form.document_type}
                  onValueChange={(v) => setForm((p) => ({ ...p, document_type: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="loi">Loi</SelectItem>
                    <SelectItem value="decret">Décret</SelectItem>
                    <SelectItem value="arrete">Arrêté</SelectItem>
                    <SelectItem value="circulaire">Circulaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doc-number">N° officiel</Label>
                <Input
                  id="doc-number"
                  value={form.official_number}
                  onChange={(e) => setForm((p) => ({ ...p, official_number: e.target.value }))}
                  placeholder="2023-XXX"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doc-date">Date de publication</Label>
                <Input
                  id="doc-date"
                  type="date"
                  value={form.published_date}
                  onChange={(e) => setForm((p) => ({ ...p, published_date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doc-order">Ordre d'affichage</Label>
                <Input
                  id="doc-order"
                  type="number"
                  value={form.display_order}
                  onChange={(e) => setForm((p) => ({ ...p, display_order: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doc-file">Fichier PDF</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="doc-file"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {file && (
                  <Badge variant="outline" className="whitespace-nowrap">
                    <Upload className="h-3 w-3 mr-1" />
                    {file.name}
                  </Badge>
                )}
              </div>
              {editingDoc?.file_url && !file && (
                <p className="text-xs text-muted-foreground">
                  Un fichier est déjà associé. Uploadez un nouveau fichier pour le remplacer.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="doc-url">URL externe (alternative au PDF)</Label>
              <Input
                id="doc-url"
                type="url"
                value={form.external_url}
                onChange={(e) => setForm((p) => ({ ...p, external_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="doc-active"
                checked={form.is_active}
                onCheckedChange={(checked) => setForm((p) => ({ ...p, is_active: checked }))}
              />
              <Label htmlFor="doc-active">Document actif (visible publiquement)</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={saving || !form.title.trim()}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {editingDoc ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce document ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le document "{docToDelete?.title}" sera définitivement supprimé.
              {docToDelete?.file_url && " Le fichier PDF associé sera aussi supprimé du stockage."}
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
