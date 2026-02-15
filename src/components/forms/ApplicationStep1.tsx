import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Building2, Save } from "lucide-react";
import { DocumentsChecklist } from "@/components/forms/DocumentsChecklist";
import { LEGAL_STATUS, SECTORS, type StartupFormData } from "./applicationFormSchema";

interface ApplicationStep1Props {
  form: UseFormReturn<StartupFormData>;
  onNext: () => void;
  onSave: () => void;
  isSaving: boolean;
}

export default function ApplicationStep1({ form, onNext, onSave, isSaving }: ApplicationStep1Props) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Building2 className="h-5 w-5" />
        Informations de l'entreprise
      </h2>

      <DocumentsChecklist className="mb-6" />

      <div className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Nom de la startup *</FormLabel>
            <FormControl><Input placeholder="Ex: TechInnovate CI" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="legal_status" render={({ field }) => (
            <FormItem>
              <FormLabel>Statut juridique *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger></FormControl>
                <SelectContent>
                  {LEGAL_STATUS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="sector" render={({ field }) => (
            <FormItem>
              <FormLabel>Secteur d'activité *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger></FormControl>
                <SelectContent>
                  {SECTORS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="rccm" render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro RCCM *</FormLabel>
              <FormControl><Input placeholder="Ex: CI-ABJ-2023-B-12345" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="tax_id" render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro d'Identification Fiscale (NIF) *</FormLabel>
              <FormControl><Input placeholder="Ex: 1234567890" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="address" render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse du siège social *</FormLabel>
            <FormControl><Input placeholder="Ex: Cocody, Rue des Jardins, Abidjan" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField control={form.control} name="founded_date" render={({ field }) => (
            <FormItem>
              <FormLabel>Date de création *</FormLabel>
              <FormControl><Input type="date" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="team_size" render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre d'employés *</FormLabel>
              <FormControl><Input type="number" min="1" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="website" render={({ field }) => (
            <FormItem>
              <FormLabel>Site web</FormLabel>
              <FormControl><Input type="url" placeholder="https://..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button type="button" variant="outline" onClick={onSave} disabled={isSaving} className="gap-2">
          <Save className="h-4 w-4" />Sauvegarder
        </Button>
        <Button type="button" onClick={onNext}>Étape suivante</Button>
      </div>
    </div>
  );
}
