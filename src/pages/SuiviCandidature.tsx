import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, FileCheck, Clock, AlertTriangle, CheckCircle, FileText, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsMobile } from "@/hooks/use-mobile";

const formSchema = z.object({
  trackingId: z.string().min(8, "L'identifiant doit contenir au moins 8 caractères"),
  email: z.string().email("Veuillez saisir une adresse email valide")
});

type FormValues = z.infer<typeof formSchema>;

const mockCandidature = {
  id: "LSN-2025-0012",
  companyName: "EcoTech Côte d'Ivoire",
  submissionDate: "2025-03-15",
  status: "Évaluation technique",
  currentStep: 2,
  steps: [
    {
      id: 1,
      name: "Soumission du dossier",
      status: "completed",
      date: "15/03/2025",
      description: "Dossier soumis et reçu par le comité de labellisation"
    },
    {
      id: 2, 
      name: "Évaluation technique", 
      status: "in-progress",
      date: "20/03/2025",
      description: "Examen technique et évaluation par les experts du comité"
    },
    {
      id: 3,
      name: "Entretien", 
      status: "pending",
      date: "Prévu le 05/04/2025",
      description: "Présentation du projet devant le comité"
    },
    {
      id: 4,
      name: "Décision finale", 
      status: "pending",
      date: "Prévue pour le 15/04/2025",
      description: "Délibération et notification de la décision"
    }
  ],
  comments: [
    {
      date: "18/03/2025",
      author: "Service d'analyse",
      content: "Documents reçus et validés. Le dossier est complet et passe à l'étape d'évaluation technique."
    },
    {
      date: "22/03/2025",
      author: "Comité technique",
      content: "Analyse en cours du business plan et des aspects d'innovation. Un complément d'information pourrait être demandé."
    }
  ],
  documents: [
    {
      name: "RCCM",
      status: "validé",
      date: "16/03/2025"
    },
    {
      name: "Déclaration fiscale",
      status: "validé",
      date: "16/03/2025"
    },
    {
      name: "Business plan",
      status: "en cours d'analyse",
      date: "20/03/2025"
    },
    {
      name: "CV des fondateurs",
      status: "validé",
      date: "17/03/2025"
    }
  ],
  nextSteps: "L'entretien avec le comité est prévu pour le 05/04/2025. Vous recevrez un email de confirmation avec les détails pratiques 3 jours avant la date."
};

const SuiviCandidature = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [candidature, setCandidature] = useState<typeof mockCandidature | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  
  const isMobile = useIsMobile();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trackingId: "",
      email: ""
    }
  });

  const trackCandidature = (values: FormValues) => {
    setIsLoading(true);
    
    // Simuler une requête API
    setTimeout(() => {
      setIsLoading(false);
      if (values.trackingId === "LSN-2025-0012" || values.trackingId === "LSN20250012") {
        setCandidature(mockCandidature);
        setShowResults(true);
        form.reset();
      } else {
        toast({
          title: "Dossier non trouvé",
          description: "Vérifiez les informations saisies et réessayez.",
          variant: "destructive"
        });
      }
    }, 1500);
  };
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-gray-400" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case "validé":
        return "bg-green-100 text-green-800";
      case "en cours d'analyse":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getProgressPercentage = () => {
    if (!candidature) return 0;
    
    const totalSteps = candidature.steps.length;
    const completedSteps = candidature.steps.filter(step => step.status === "completed").length;
    const inProgressStep = candidature.steps.some(step => step.status === "in-progress") ? 0.5 : 0;
    
    return Math.round(((completedSteps + inProgressStep) / totalSteps) * 100);
  };
  
  const viewDocumentDetails = (docName: string) => {
    setSelectedDoc(docName);
    setOpen(true);
  };
  
  const openDocument = isMobile 
    ? (docName: string) => {
        viewDocumentDetails(docName);
      }
    : (docName: string) => {
        viewDocumentDetails(docName);
      };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Suivi de votre candidature</h1>
              <p className="text-gray-600">
                Suivez l'état d'avancement de votre demande de labellisation
              </p>
            </div>
            
            {!showResults ? (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Rechercher votre dossier</CardTitle>
                  <CardDescription>
                    Entrez l'identifiant de suivi et l'email utilisés lors de votre candidature
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(trackCandidature)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="trackingId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Identifiant de suivi</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: LSN-2025-0012" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email du responsable</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="votre@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Recherche en cours..." : "Rechercher mon dossier"}
                        <Search className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-gray-500">
                  <p>Pour toute assistance, contactez-nous à support@labelstartup.ci</p>
                </CardFooter>
              </Card>
            ) : candidature ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{candidature.companyName}</CardTitle>
                        <CardDescription>
                          Dossier N° {candidature.id} • Soumis le {candidature.submissionDate}
                        </CardDescription>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{candidature.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Progression du dossier</span>
                        <span className="text-sm font-medium">{getProgressPercentage()}%</span>
                      </div>
                      <Progress value={getProgressPercentage()} className="h-2" />
                    </div>
                    
                    <div className="space-y-6 mt-6">
                      <h3 className="font-medium text-gray-900">Étapes du processus</h3>
                      <div className="space-y-4">
                        {candidature.steps.map((step) => (
                          <div key={step.id} className="flex gap-4">
                            <div className="flex-shrink-0 mt-1">
                              {getStatusIcon(step.status)}
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between">
                                <p className="font-medium text-gray-900">{step.name}</p>
                                <p className="text-sm text-gray-500">{step.date}</p>
                              </div>
                              <p className="text-sm text-gray-600 mt-0.5">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Tabs defaultValue="documents">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="comments">Commentaires</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="documents" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Documents soumis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {candidature.documents.map((doc, index) => (
                            <div 
                              key={index} 
                              className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                              onClick={() => openDocument(doc.name)}
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-gray-500" />
                                <span className="font-medium">{doc.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(doc.status)}>{doc.status}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="comments" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Historique des commentaires</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {candidature.comments.map((comment, index) => (
                            <div key={index} className="border-l-2 border-gray-200 pl-4 py-1">
                              <div className="flex justify-between">
                                <p className="font-medium">{comment.author}</p>
                                <p className="text-sm text-gray-500">{comment.date}</p>
                              </div>
                              <p className="text-gray-600 mt-1">{comment.content}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Prochaines étapes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{candidature.nextSteps}</p>
                  </CardContent>
                </Card>
                
                <div className="flex justify-center gap-4 pt-2">
                  <Button variant="outline" onClick={() => setShowResults(false)}>
                    Nouvelle recherche
                  </Button>
                  <Button onClick={() => navigate("/")}>
                    Retour à l'accueil
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>
      
      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Document: {selectedDoc}</DrawerTitle>
              <DrawerDescription>Détails du document soumis</DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <div className="p-6 border rounded-lg bg-gray-50 text-center">
                <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">Le document a été enregistré et est en cours d'analyse par notre équipe.</p>
                <p className="text-xs text-gray-500">Téléchargé le 15/03/2025</p>
              </div>
            </div>
            <DrawerFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Fermer
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Document: {selectedDoc}</DialogTitle>
              <DialogDescription>Détails du document soumis</DialogDescription>
            </DialogHeader>
            <div className="p-6 border rounded-lg bg-gray-50 text-center">
              <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">Le document a été enregistré et est en cours d'analyse par notre équipe.</p>
              <p className="text-xs text-gray-500">Téléchargé le 15/03/2025</p>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Fermer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      <Footer />
    </div>
  );
};

export default SuiviCandidature;
