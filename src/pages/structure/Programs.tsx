import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStructureData } from "@/hooks/useStructureData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FolderKanban, Plus, Pencil, Trash2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Program {
  id: string;
  name: string;
  description?: string;
  duration?: string;
  status: string;
}

export default function StructurePrograms() {
  const { structure, updateStructure, isLoading } = useStructureData();
  const { t } = useTranslation("dashboard");
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", duration: "" });

  const programs: Program[] = Array.isArray(structure?.programs)
    ? structure.programs
    : [];

  const handleSave = async () => {
    if (!formData.name.trim()) return;

    let updatedPrograms: Program[];
    if (editingProgram) {
      updatedPrograms = programs.map((p) =>
        p.id === editingProgram.id
          ? { ...p, ...formData }
          : p
      );
    } else {
      updatedPrograms = [
        ...programs,
        {
          id: crypto.randomUUID(),
          ...formData,
          status: "active",
        },
      ];
    }

    const result = await updateStructure({ programs: updatedPrograms });
    if (!result?.error) {
      toast({
        title: editingProgram
          ? t("structure.programs.updated")
          : t("structure.programs.created"),
      });
      setDialogOpen(false);
      setEditingProgram(null);
      setFormData({ name: "", description: "", duration: "" });
    }
  };

  const handleDelete = async (id: string) => {
    const updatedPrograms = programs.filter((p) => p.id !== id);
    const result = await updateStructure({ programs: updatedPrograms });
    if (!result?.error) {
      toast({ title: t("structure.programs.deleted") });
    }
  };

  const openEdit = (program: Program) => {
    setEditingProgram(program);
    setFormData({
      name: program.name,
      description: program.description,
      duration: program.duration,
    });
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditingProgram(null);
    setFormData({ name: "", description: "", duration: "" });
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("structure.programs.title")}</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              {t("structure.programs.add")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProgram
                  ? t("structure.programs.editTitle")
                  : t("structure.programs.addTitle")}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>{t("structure.programs.form.name")}</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder={t("structure.programs.form.namePlaceholder")}
                />
              </div>
              <div>
                <Label>{t("structure.programs.form.description")}</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder={t("structure.programs.form.descriptionPlaceholder")}
                />
              </div>
              <div>
                <Label>{t("structure.programs.form.duration")}</Label>
                <Input
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder={t("structure.programs.form.durationPlaceholder")}
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                {editingProgram
                  ? t("structure.programs.form.save")
                  : t("structure.programs.form.create")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {programs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-4">
              {t("structure.programs.empty")}
            </p>
            <Button variant="outline" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              {t("structure.programs.add")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map((program) => (
            <Card key={program.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FolderKanban className="h-5 w-5 text-primary" />
                    {program.name}
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEdit(program)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(program.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {program.description || "—"}
                </p>
                <div className="flex items-center gap-2">
                  {program.duration && (
                    <Badge variant="secondary">{program.duration}</Badge>
                  )}
                  <Badge
                    variant={
                      program.status === "active" ? "success" : "secondary"
                    }
                  >
                    {program.status === "active" ? "Actif" : "Terminé"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
