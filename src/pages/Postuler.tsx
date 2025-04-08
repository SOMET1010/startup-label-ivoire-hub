
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

const Postuler = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Candidature soumise avec succès",
        description: "Votre dossier a été transmis au Comité de Labellisation pour examen.",
      });
    }, 2000);
  };
  
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Demande de labellisation</h1>
              <p className="text-gray-600">
                Complétez ce formulaire pour soumettre votre candidature au Label Startup numérique
              </p>
            </div>
            
            {/* Progress bar */}
            <div className="mb-8">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-ivoire-orange to-ivoire-green h-2.5 rounded-full" 
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className={currentStep >= 1 ? "text-ivoire-orange font-medium" : "text-gray-500"}>Informations générales</span>
                <span className={currentStep >= 2 ? "text-ivoire-orange font-medium" : "text-gray-500"}>Équipe & Innovation</span>
                <span className={currentStep >= 3 ? "text-ivoire-orange font-medium" : "text-gray-500"}>Documents</span>
                <span className={currentStep >= 4 ? "text-ivoire-orange font-medium" : "text-gray-500"}>Validation</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-8">
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Informations générales de la startup</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Nom de la startup</Label>
                      <Input id="companyName" type="text" required />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="legalStatus">Forme juridique</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sarl">SARL</SelectItem>
                            <SelectItem value="sa">SA</SelectItem>
                            <SelectItem value="sas">SAS</SelectItem>
                            <SelectItem value="ei">Entreprise Individuelle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="creationDate">Date de création</Label>
                        <Input id="creationDate" type="date" required />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="rccm">Numéro de RCCM</Label>
                        <Input id="rccm" type="text" required />
                      </div>
                      
                      <div>
                        <Label htmlFor="taxId">Numéro de compte contribuable</Label>
                        <Input id="taxId" type="text" required />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="sector">Secteur d'activité</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fintech">FinTech</SelectItem>
                          <SelectItem value="edtech">EdTech</SelectItem>
                          <SelectItem value="healthtech">HealthTech</SelectItem>
                          <SelectItem value="agritech">AgriTech</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="mobility">Mobilité</SelectItem>
                          <SelectItem value="other">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Adresse du siège social</Label>
                      <Textarea id="address" rows={3} required />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="website">Site web</Label>
                        <Input id="website" type="url" placeholder="https://" />
                      </div>
                      
                      <div>
                        <Label htmlFor="employees">Nombre d'employés</Label>
                        <Input id="employees" type="number" min="1" required />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <Button onClick={nextStep}>
                      Étape suivante
                    </Button>
                  </div>
                </div>
              )}
              
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Équipe & Innovation</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="founderInfo" className="mb-2 block">Informations sur les fondateurs</Label>
                      <Textarea 
                        id="founderInfo" 
                        rows={4} 
                        placeholder="Présentez brièvement les fondateurs, leurs parcours et compétences."
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="projectDesc" className="mb-2 block">Description du projet</Label>
                      <Textarea 
                        id="projectDesc" 
                        rows={4} 
                        placeholder="Décrivez votre projet ou produit en détail."
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="innovation" className="mb-2 block">Caractère innovant</Label>
                      <Textarea 
                        id="innovation" 
                        rows={4} 
                        placeholder="En quoi votre solution est-elle innovante ? Quelle est votre proposition de valeur ?"
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="businessModel" className="mb-2 block">Modèle économique</Label>
                      <Textarea 
                        id="businessModel" 
                        rows={4} 
                        placeholder="Décrivez votre modèle économique et comment vous générez ou prévoyez de générer des revenus."
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="growth" className="mb-2 block">Potentiel de croissance</Label>
                      <Textarea 
                        id="growth" 
                        rows={4} 
                        placeholder="Décrivez le potentiel de croissance de votre startup et votre stratégie de développement."
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <Button variant="outline" onClick={prevStep}>
                      Étape précédente
                    </Button>
                    
                    <Button onClick={nextStep}>
                      Étape suivante
                    </Button>
                  </div>
                </div>
              )}
              
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Documents à fournir</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="rccmDoc" className="mb-2 block">Registre de Commerce (RCCM)</Label>
                      <Input id="rccmDoc" type="file" className="cursor-pointer" required />
                      <p className="text-xs text-gray-500 mt-1">Format PDF, max 5MB</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="taxDoc" className="mb-2 block">Déclaration fiscale d'existence</Label>
                      <Input id="taxDoc" type="file" className="cursor-pointer" required />
                      <p className="text-xs text-gray-500 mt-1">Format PDF, max 5MB</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="statutesDoc" className="mb-2 block">Statuts de l'entreprise</Label>
                      <Input id="statutesDoc" type="file" className="cursor-pointer" required />
                      <p className="text-xs text-gray-500 mt-1">Format PDF, max 5MB</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="businessPlanDoc" className="mb-2 block">Business plan</Label>
                      <Input id="businessPlanDoc" type="file" className="cursor-pointer" required />
                      <p className="text-xs text-gray-500 mt-1">Format PDF, max 10MB</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="cvDoc" className="mb-2 block">CV des fondateurs</Label>
                      <Input id="cvDoc" type="file" className="cursor-pointer" required />
                      <p className="text-xs text-gray-500 mt-1">Format PDF, max 10MB</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="pitchDoc" className="mb-2 block">Présentation (pitch deck)</Label>
                      <Input id="pitchDoc" type="file" className="cursor-pointer" required />
                      <p className="text-xs text-gray-500 mt-1">Format PDF ou PPT, max 15MB</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="otherDocs" className="mb-2 block">Autres documents (facultatif)</Label>
                      <Input id="otherDocs" type="file" className="cursor-pointer" multiple />
                      <p className="text-xs text-gray-500 mt-1">Format PDF, max 20MB au total</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <Button variant="outline" onClick={prevStep}>
                      Étape précédente
                    </Button>
                    
                    <Button onClick={nextStep}>
                      Étape suivante
                    </Button>
                  </div>
                </div>
              )}
              
              {currentStep === 4 && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Révision et soumission</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-bold mb-2">Récapitulatif de votre candidature</h3>
                      <p className="text-gray-600 mb-4">
                        Veuillez vérifier attentivement les informations renseignées avant de soumettre votre candidature.
                      </p>
                      
                      <Tabs defaultValue="general">
                        <TabsList className="mb-4">
                          <TabsTrigger value="general">Informations générales</TabsTrigger>
                          <TabsTrigger value="team">Équipe & Innovation</TabsTrigger>
                          <TabsTrigger value="docs">Documents</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="general">
                          <div className="text-sm">
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <div className="font-medium">Nom de la startup :</div>
                              <div>Demo Startup</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <div className="font-medium">Forme juridique :</div>
                              <div>SARL</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <div className="font-medium">Date de création :</div>
                              <div>01/01/2023</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <div className="font-medium">Secteur d'activité :</div>
                              <div>FinTech</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <div className="font-medium">Nombre d'employés :</div>
                              <div>12</div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="team">
                          <div className="text-sm">
                            <div className="mb-2">
                              <div className="font-medium mb-1">Informations sur les fondateurs :</div>
                              <div className="text-gray-600">John Doe - CEO, expertise en finance...</div>
                            </div>
                            <div className="mb-2">
                              <div className="font-medium mb-1">Description du projet :</div>
                              <div className="text-gray-600">Solution mobile de paiement pour les PME...</div>
                            </div>
                            <div className="mb-2">
                              <div className="font-medium mb-1">Caractère innovant :</div>
                              <div className="text-gray-600">Utilisation de l'IA pour l'analyse prédictive...</div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="docs">
                          <div className="text-sm">
                            <ul className="space-y-1 list-disc list-inside text-gray-600">
                              <li>Registre de Commerce (RCCM) - rccm.pdf</li>
                              <li>Déclaration fiscale d'existence - dfe.pdf</li>
                              <li>Statuts de l'entreprise - statuts.pdf</li>
                              <li>Business plan - bp.pdf</li>
                              <li>CV des fondateurs - cv.pdf</li>
                              <li>Présentation (pitch deck) - pitch.pdf</li>
                            </ul>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox id="terms" required />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="terms" className="text-sm font-normal">
                          Je certifie que les informations fournies sont exactes et complètes.
                        </Label>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox id="privacy" required />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="privacy" className="text-sm font-normal">
                          J'accepte que mes données soient traitées conformément à la politique de confidentialité.
                        </Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <Button variant="outline" onClick={prevStep}>
                      Étape précédente
                    </Button>
                    
                    <Button onClick={handleSubmit} disabled={isLoading}>
                      {isLoading ? "Soumission en cours..." : "Soumettre ma candidature"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Postuler;
