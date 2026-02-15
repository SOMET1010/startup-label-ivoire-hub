import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Users, Save } from "lucide-react";
import { STAGES, type StartupFormData } from "./applicationFormSchema";

interface ApplicationStep2Props {
  form: UseFormReturn<StartupFormData>;
  onNext: () => void;
  onPrev: () => void;
  onSave: () => void;
  isSaving: boolean;
}

export default function ApplicationStep2({ form, onNext, onPrev, onSave, isSaving }: ApplicationStep2Props) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Users className="h-5 w-5" />
        Projet et Équipe
      </h2>

      <div className="space-y-6">
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Description du projet *</FormLabel>
            <FormControl>
              <Textarea rows={4} placeholder="Décrivez votre projet, votre proposition de valeur et votre marché cible..." {...field} />
            </FormControl>
            <FormDescription>{field.value.length}/2000 caractères (minimum 50)</FormDescription>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="innovation" render={({ field }) => (
          <FormItem>
            <FormLabel>Innovation et différenciation *</FormLabel>
            <FormControl>
              <Textarea rows={3} placeholder="Qu'est-ce qui rend votre solution innovante ?" {...field} />
            </FormControl>
            <FormDescription>{field.value.length}/1000 caractères</FormDescription>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="business_model" render={({ field }) => (
          <FormItem>
            <FormLabel>Modèle économique *</FormLabel>
            <FormControl>
              <Textarea rows={3} placeholder="Comment générez-vous des revenus ?" {...field} />
            </FormControl>
            <FormDescription>{field.value.length}/1000 caractères</FormDescription>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="growth_potential" render={({ field }) => (
          <FormItem>
            <FormLabel>Potentiel de croissance *</FormLabel>
            <FormControl>
              <Textarea rows={3} placeholder="Quel est le potentiel de marché ? Quels sont vos objectifs à 3-5 ans ?" {...field} />
            </FormControl>
            <FormDescription>{field.value.length}/1000 caractères</FormDescription>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="stage" render={({ field }) => (
            <FormItem>
              <FormLabel>Stade de développement *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Sélectionner le stade" /></SelectTrigger></FormControl>
                <SelectContent>
                  {STAGES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="founder_info" render={({ field }) => (
          <FormItem>
            <FormLabel>Présentation des fondateurs *</FormLabel>
            <FormControl>
              <Textarea rows={3} placeholder="Présentez brièvement les fondateurs et leurs parcours..." {...field} />
            </FormControl>
            <FormDescription>{field.value.length}/500 caractères</FormDescription>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <div className="mt-8 flex justify-between">
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onPrev}>Étape précédente</Button>
          <Button type="button" variant="ghost" onClick={onSave} disabled={isSaving} className="gap-2">
            <Save className="h-4 w-4" />Sauvegarder
          </Button>
        </div>
        <Button type="button" onClick={onNext}>Étape suivante</Button>
      </div>
    </div>
  );
}
