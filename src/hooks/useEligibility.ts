import { useState, useCallback, useEffect } from 'react';
import { z } from 'zod';

export const eligibilitySchema = z.object({
  rccm: z.string().optional(),
  foundedDate: z.string().min(1, "Date de création requise"),
  sector: z.string().min(1, "Secteur requis"),
  capitalOwnership: z.enum(["physical_persons", "legal_entities", "mixed"]),
  stage: z.string().min(1, "Stade requis"),
  hasInnovation: z.boolean(),
  innovationTypes: z.array(z.string()).optional(),
  scalabilityPotential: z.enum(["low", "medium", "high"]),
});

export type EligibilityData = z.infer<typeof eligibilitySchema>;

export interface EligibilityResult {
  isEligible: boolean;
  score: number;
  passedCriteria: string[];
  failedCriteria: string[];
  warnings: string[];
}

const STORAGE_KEY = 'startup_eligibility_quiz';

const ELIGIBLE_SECTORS = [
  'fintech',
  'healthtech',
  'edtech',
  'agritech',
  'e-commerce',
  'logistique',
  'energie',
  'immobilier',
  'tourisme',
  'medias',
  'cybersecurite',
  'ia',
  'iot',
  'blockchain',
  'saas',
  'autre'
];

export function useEligibility() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<Partial<EligibilityData>>({});
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.data) setData(parsed.data);
        if (parsed.result) {
          setResult(parsed.result);
          setIsCompleted(true);
        }
      } catch (e) {
        console.error('Error loading eligibility data:', e);
      }
    }
  }, []);

  // Save data to localStorage
  const saveData = useCallback((newData: Partial<EligibilityData>, newResult?: EligibilityResult) => {
    const toSave = {
      data: newData,
      result: newResult || null,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, []);

  const updateData = useCallback((field: keyof EligibilityData, value: unknown) => {
    setData(prev => {
      const newData = { ...prev, [field]: value };
      saveData(newData);
      return newData;
    });
  }, [saveData]);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 7));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(1, Math.min(step, 7)));
  }, []);

  const calculateEligibility = useCallback((): EligibilityResult => {
    const passedCriteria: string[] = [];
    const failedCriteria: string[] = [];
    const warnings: string[] = [];
    let score = 0;

    // Check RCCM (optional but valued)
    if (data.rccm && data.rccm.length > 0) {
      passedCriteria.push("Numéro RCCM fourni");
      score += 10;
    } else {
      warnings.push("Numéro RCCM non fourni (sera requis lors de la candidature)");
    }

    // Check company age (BLOCKING - max 8 years)
    if (data.foundedDate) {
      const foundedDate = new Date(data.foundedDate);
      const today = new Date();
      const ageInYears = (today.getTime() - foundedDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      
      if (ageInYears <= 8) {
        passedCriteria.push(`Entreprise de moins de 8 ans (${Math.floor(ageInYears)} ans)`);
        score += 15;
      } else {
        failedCriteria.push(`Entreprise de plus de 8 ans (créée le ${foundedDate.toLocaleDateString('fr-FR')})`);
      }
    }

    // Check sector
    if (data.sector && ELIGIBLE_SECTORS.includes(data.sector.toLowerCase())) {
      passedCriteria.push(`Secteur éligible : ${data.sector}`);
      score += 15;
    } else if (data.sector) {
      warnings.push(`Secteur "${data.sector}" - éligibilité à vérifier`);
      score += 5;
    }

    // Check capital ownership (BLOCKING)
    if (data.capitalOwnership === 'physical_persons') {
      passedCriteria.push("Capital détenu majoritairement par des personnes physiques");
      score += 20;
    } else if (data.capitalOwnership === 'mixed') {
      warnings.push("Capital mixte - la majorité doit être détenue par des personnes physiques");
      score += 10;
    } else if (data.capitalOwnership === 'legal_entities') {
      failedCriteria.push("Capital détenu majoritairement par des personnes morales");
    }

    // Check stage (informative)
    if (data.stage) {
      passedCriteria.push(`Stade de développement : ${data.stage}`);
      score += 10;
    }

    // Check innovation (BLOCKING)
    if (data.hasInnovation === true) {
      passedCriteria.push("Proposition de valeur innovante");
      score += 15;
      
      if (data.innovationTypes && data.innovationTypes.length > 0) {
        score += Math.min(data.innovationTypes.length * 2, 5);
      }
    } else if (data.hasInnovation === false) {
      failedCriteria.push("Pas d'innovation déclarée");
    }

    // Check scalability
    if (data.scalabilityPotential === 'high') {
      passedCriteria.push("Fort potentiel de scalabilité");
      score += 15;
    } else if (data.scalabilityPotential === 'medium') {
      passedCriteria.push("Potentiel de scalabilité moyen");
      score += 10;
    } else if (data.scalabilityPotential === 'low') {
      warnings.push("Faible potentiel de scalabilité déclaré");
      score += 5;
    }

    const isEligible = failedCriteria.length === 0;

    return {
      isEligible,
      score: Math.min(score, 100),
      passedCriteria,
      failedCriteria,
      warnings
    };
  }, [data]);

  const submitQuiz = useCallback(() => {
    const eligibilityResult = calculateEligibility();
    setResult(eligibilityResult);
    setIsCompleted(true);
    saveData(data, eligibilityResult);
    return eligibilityResult;
  }, [calculateEligibility, data, saveData]);

  const resetQuiz = useCallback(() => {
    setCurrentStep(1);
    setData({});
    setResult(null);
    setIsCompleted(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getDataForApplication = useCallback(() => {
    return {
      rccm: data.rccm,
      foundedDate: data.foundedDate,
      sector: data.sector,
      stage: data.stage,
    };
  }, [data]);

  return {
    currentStep,
    totalSteps: 7,
    data,
    result,
    isCompleted,
    updateData,
    nextStep,
    prevStep,
    goToStep,
    submitQuiz,
    resetQuiz,
    getDataForApplication,
    eligibleSectors: ELIGIBLE_SECTORS,
  };
}
