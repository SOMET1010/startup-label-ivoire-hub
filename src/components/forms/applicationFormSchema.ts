import { z } from "zod";
import { Building2, Users, Upload, ClipboardCheck } from "lucide-react";
import { LEGAL_STATUS, SECTORS, STAGES } from "@/lib/constants/startup";

// File validation helper
export const fileSchema = (required: boolean = false) => {
  return z.custom<File | null>((val) => {
    if (required && !val) return false;
    if (!val) return true;
    if (!(val instanceof File)) return false;
    const maxSize = 10 * 1024 * 1024; // 10MB
    return val.size <= maxSize;
  }, {
    message: required ? "Ce document est requis" : "Fichier invalide ou trop volumineux (max 10 Mo)"
  }).nullable();
};

export const startupFormSchema = z.object({
  // Étape 1: Informations entreprise
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  legal_status: z.string().min(1, "Veuillez sélectionner un statut juridique"),
  rccm: z.string().min(1, "Le numéro RCCM est requis").max(50, "Numéro RCCM trop long"),
  tax_id: z.string().min(1, "Le NIF est requis").max(50, "NIF trop long"),
  sector: z.string().min(1, "Veuillez sélectionner un secteur"),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères").max(200, "Adresse trop longue"),
  founded_date: z.string().min(1, "La date de création est requise"),
  website: z.string().url("URL invalide").or(z.literal("")).optional(),
  team_size: z.coerce.number().min(1, "Minimum 1 employé").max(10000, "Maximum 10000 employés"),

  // Étape 2: Projet et équipe
  description: z.string().min(50, "La description doit contenir au moins 50 caractères").max(2000, "La description ne peut pas dépasser 2000 caractères"),
  innovation: z.string().min(20, "Décrivez votre innovation (min 20 caractères)").max(1000, "Maximum 1000 caractères"),
  business_model: z.string().min(20, "Décrivez votre modèle économique (min 20 caractères)").max(1000, "Maximum 1000 caractères"),
  growth_potential: z.string().min(20, "Décrivez votre potentiel de croissance (min 20 caractères)").max(1000, "Maximum 1000 caractères"),
  stage: z.string().min(1, "Veuillez sélectionner un stade"),
  founder_info: z.string().min(10, "Présentez brièvement les fondateurs (min 10 caractères)").max(500, "Maximum 500 caractères"),

  // Étape 3: Documents
  doc_rccm: fileSchema(true),
  doc_tax: fileSchema(true),
  doc_business_plan: fileSchema(true),
  doc_statutes: fileSchema(false),
  doc_cv: fileSchema(false),
  doc_pitch: fileSchema(false),

  // Étape 4: Validation
  terms_accepted: z.boolean().refine(val => val === true, "Vous devez accepter les conditions"),
});

export type StartupFormData = z.infer<typeof startupFormSchema>;

export const STEPS = [
  { id: 1, label: "Entreprise", icon: Building2 },
  { id: 2, label: "Projet", icon: Users },
  { id: 3, label: "Documents", icon: Upload },
  { id: 4, label: "Validation", icon: ClipboardCheck },
];

// Re-export for convenience
export { LEGAL_STATUS, SECTORS, STAGES };
