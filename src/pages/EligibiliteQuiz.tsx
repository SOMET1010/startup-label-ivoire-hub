import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Calendar, 
  Building2, 
  Users, 
  Rocket, 
  Lightbulb, 
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  ClipboardCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { QuizProgress } from "@/components/eligibility/QuizProgress";
import { QuizQuestion } from "@/components/eligibility/QuizQuestion";
import { EligibilityResult } from "@/components/eligibility/EligibilityResult";
import { useEligibility } from "@/hooks/useEligibility";

const SECTORS = [
  { value: "fintech", label: "FinTech" },
  { value: "healthtech", label: "HealthTech / E-santé" },
  { value: "edtech", label: "EdTech / E-learning" },
  { value: "agritech", label: "AgriTech" },
  { value: "e-commerce", label: "E-commerce" },
  { value: "logistique", label: "Logistique / Transport" },
  { value: "energie", label: "Énergie / CleanTech" },
  { value: "immobilier", label: "PropTech / Immobilier" },
  { value: "tourisme", label: "Tourisme / Loisirs" },
  { value: "medias", label: "Médias / Divertissement" },
  { value: "cybersecurite", label: "Cybersécurité" },
  { value: "ia", label: "Intelligence Artificielle" },
  { value: "iot", label: "IoT / Objets connectés" },
  { value: "blockchain", label: "Blockchain / Web3" },
  { value: "saas", label: "SaaS / Logiciels" },
  { value: "autre", label: "Autre secteur numérique" },
];

const STAGES = [
  { value: "ideation", label: "Idéation - J'ai une idée" },
  { value: "prototype", label: "Prototype - MVP en développement" },
  { value: "lancement", label: "Lancement - Produit sur le marché" },
  { value: "croissance", label: "Croissance - Traction et revenus" },
  { value: "scale", label: "Scale-up - Expansion" },
];

const INNOVATION_TYPES = [
  { id: "tech", label: "Innovation technologique (nouveau procédé, technologie)" },
  { id: "model", label: "Innovation de modèle économique (nouveau business model)" },
  { id: "usage", label: "Innovation d'usage (nouvelle expérience utilisateur)" },
  { id: "social", label: "Innovation sociale (impact positif sur la société)" },
  { id: "market", label: "Innovation de marché (nouveau segment, nouvelle géographie)" },
];

export default function EligibiliteQuiz() {
  const navigate = useNavigate();
  const {
    currentStep,
    totalSteps,
    data,
    result,
    isCompleted,
    updateData,
    nextStep,
    prevStep,
    submitQuiz,
    resetQuiz,
  } = useEligibility();

  const [selectedInnovationTypes, setSelectedInnovationTypes] = useState<string[]>(
    data.innovationTypes || []
  );

  const handleInnovationTypeChange = (typeId: string, checked: boolean) => {
    const newTypes = checked
      ? [...selectedInnovationTypes, typeId]
      : selectedInnovationTypes.filter(id => id !== typeId);
    setSelectedInnovationTypes(newTypes);
    updateData("innovationTypes", newTypes);
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1: return true; // RCCM is optional
      case 2: return !!data.foundedDate;
      case 3: return !!data.sector;
      case 4: return !!data.capitalOwnership;
      case 5: return !!data.stage;
      case 6: return data.hasInnovation !== undefined;
      case 7: return !!data.scalabilityPotential;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep === totalSteps) {
      submitQuiz();
    } else {
      nextStep();
    }
  };

  if (isCompleted && result) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 px-4">
          <div className="container max-w-4xl mx-auto">
            <EligibilityResult result={result} onReset={resetQuiz} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Vérifiez votre éligibilité
            </h1>
            <p className="text-muted-foreground">
              Répondez à quelques questions pour savoir si votre startup est éligible au Label
            </p>
          </div>

          {/* Progress */}
          <QuizProgress currentStep={currentStep} totalSteps={totalSteps} />

          {/* Quiz Card */}
          <Card className="mt-8">
            <CardContent className="pt-8 pb-6 px-6">
              {/* Step 1: RCCM */}
              {currentStep === 1 && (
                <QuizQuestion
                  icon={<FileText className="w-8 h-8" />}
                  title="Numéro RCCM"
                  description="Avez-vous un numéro RCCM ? (Optionnel mais recommandé)"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="rccm">Numéro RCCM (optionnel)</Label>
                      <Input
                        id="rccm"
                        placeholder="Ex: CI-ABJ-2020-B-12345"
                        value={data.rccm || ""}
                        onChange={(e) => updateData("rccm", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Le RCCM sera requis lors de la candidature complète
                      </p>
                    </div>
                  </div>
                </QuizQuestion>
              )}

              {/* Step 2: Founded Date */}
              {currentStep === 2 && (
                <QuizQuestion
                  icon={<Calendar className="w-8 h-8" />}
                  title="Date de création"
                  description="Quelle est la date de création de votre entreprise ?"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="foundedDate">Date de création *</Label>
                      <Input
                        id="foundedDate"
                        type="date"
                        value={data.foundedDate || ""}
                        onChange={(e) => updateData("foundedDate", e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                      />
                      <p className="text-xs text-muted-foreground">
                        L'entreprise doit avoir moins de 8 ans pour être éligible
                      </p>
                    </div>
                  </div>
                </QuizQuestion>
              )}

              {/* Step 3: Sector */}
              {currentStep === 3 && (
                <QuizQuestion
                  icon={<Building2 className="w-8 h-8" />}
                  title="Secteur d'activité"
                  description="Dans quel secteur numérique opérez-vous ?"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Secteur principal *</Label>
                      <Select
                        value={data.sector || ""}
                        onValueChange={(value) => updateData("sector", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un secteur" />
                        </SelectTrigger>
                        <SelectContent>
                          {SECTORS.map((sector) => (
                            <SelectItem key={sector.value} value={sector.value}>
                              {sector.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </QuizQuestion>
              )}

              {/* Step 4: Capital Ownership */}
              {currentStep === 4 && (
                <QuizQuestion
                  icon={<Users className="w-8 h-8" />}
                  title="Détention du capital"
                  description="Qui détient majoritairement le capital de votre entreprise ?"
                >
                  <div className="space-y-4">
                    <RadioGroup
                      value={data.capitalOwnership || ""}
                      onValueChange={(value) => updateData("capitalOwnership", value as "physical_persons" | "legal_entities" | "mixed")}
                      className="space-y-3"
                    >
                      <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="physical_persons" id="physical" />
                        <div className="space-y-1">
                          <Label htmlFor="physical" className="font-medium cursor-pointer">
                            Personnes physiques (individus)
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Le capital est détenu majoritairement par des fondateurs ou investisseurs individuels
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="mixed" id="mixed" />
                        <div className="space-y-1">
                          <Label htmlFor="mixed" className="font-medium cursor-pointer">
                            Capital mixte
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Mélange de personnes physiques et morales (entreprises, fonds)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="legal_entities" id="legal" />
                        <div className="space-y-1">
                          <Label htmlFor="legal" className="font-medium cursor-pointer">
                            Personnes morales (entreprises, fonds)
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Le capital est détenu majoritairement par des entreprises ou fonds d'investissement
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-muted-foreground">
                      Le capital doit être détenu majoritairement par des personnes physiques pour être éligible
                    </p>
                  </div>
                </QuizQuestion>
              )}

              {/* Step 5: Stage */}
              {currentStep === 5 && (
                <QuizQuestion
                  icon={<Rocket className="w-8 h-8" />}
                  title="Stade de développement"
                  description="À quel stade de développement se trouve votre startup ?"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Stade actuel *</Label>
                      <Select
                        value={data.stage || ""}
                        onValueChange={(value) => updateData("stage", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un stade" />
                        </SelectTrigger>
                        <SelectContent>
                          {STAGES.map((stage) => (
                            <SelectItem key={stage.value} value={stage.value}>
                              {stage.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </QuizQuestion>
              )}

              {/* Step 6: Innovation */}
              {currentStep === 6 && (
                <QuizQuestion
                  icon={<Lightbulb className="w-8 h-8" />}
                  title="Innovation"
                  description="Votre startup propose-t-elle une innovation ?"
                >
                  <div className="space-y-6">
                    <RadioGroup
                      value={data.hasInnovation === true ? "yes" : data.hasInnovation === false ? "no" : ""}
                      onValueChange={(value) => updateData("hasInnovation", value === "yes")}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="yes" id="innovation-yes" />
                        <Label htmlFor="innovation-yes" className="font-medium cursor-pointer">
                          Oui, nous proposons une innovation
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="no" id="innovation-no" />
                        <Label htmlFor="innovation-no" className="font-medium cursor-pointer">
                          Non, nous n'avons pas d'innovation particulière
                        </Label>
                      </div>
                    </RadioGroup>

                    {data.hasInnovation && (
                      <div className="space-y-3 pt-4 border-t animate-fade-in">
                        <Label>Type(s) d'innovation (optionnel)</Label>
                        {INNOVATION_TYPES.map((type) => (
                          <div key={type.id} className="flex items-start space-x-3">
                            <Checkbox
                              id={type.id}
                              checked={selectedInnovationTypes.includes(type.id)}
                              onCheckedChange={(checked) => 
                                handleInnovationTypeChange(type.id, checked as boolean)
                              }
                            />
                            <Label htmlFor={type.id} className="text-sm cursor-pointer">
                              {type.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </QuizQuestion>
              )}

              {/* Step 7: Scalability */}
              {currentStep === 7 && (
                <QuizQuestion
                  icon={<TrendingUp className="w-8 h-8" />}
                  title="Potentiel de croissance"
                  description="Quel est le potentiel de scalabilité de votre solution ?"
                >
                  <div className="space-y-4">
                    <RadioGroup
                      value={data.scalabilityPotential || ""}
                      onValueChange={(value) => updateData("scalabilityPotential", value as "low" | "medium" | "high")}
                      className="space-y-3"
                    >
                      <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="high" id="scale-high" />
                        <div className="space-y-1">
                          <Label htmlFor="scale-high" className="font-medium cursor-pointer">
                            Fort potentiel
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Solution réplicable à grande échelle, marché international visé
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="medium" id="scale-medium" />
                        <div className="space-y-1">
                          <Label htmlFor="scale-medium" className="font-medium cursor-pointer">
                            Potentiel moyen
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Croissance possible sur le marché régional/national
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="low" id="scale-low" />
                        <div className="space-y-1">
                          <Label htmlFor="scale-low" className="font-medium cursor-pointer">
                            Potentiel limité
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Activité locale, croissance limitée
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </QuizQuestion>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Précédent
                </Button>
                
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="gap-2"
                >
                  {currentStep === totalSteps ? "Voir les résultats" : "Suivant"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
