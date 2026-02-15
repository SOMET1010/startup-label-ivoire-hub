import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Building2, 
  Users, 
  FileText, 
  Settings, 
  Save, 
  Loader2,
  Globe,
  Calendar,
  MapPin,
  Briefcase,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Download,
  ExternalLink,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { 
  useSecureDocument, 
  isPreviewable, 
  getDocumentType 
} from '@/hooks/useSecureDocument';
import { ThemeToggle } from '@/components/ThemeToggle';

const profileFormSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z.string().min(20, 'La description doit contenir au moins 20 caractères').max(2000),
  sector: z.string().min(1, 'Veuillez sélectionner un secteur'),
  stage: z.string().min(1, 'Veuillez sélectionner un stade'),
  website: z.string().url('URL invalide').or(z.literal('')).optional(),
  team_size: z.coerce.number().min(1).max(10000),
  address: z.string().optional(),
  innovation: z.string().optional(),
  business_model: z.string().optional(),
  is_visible_in_directory: z.boolean(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

interface Startup {
  id: string;
  name: string;
  description: string | null;
  sector: string | null;
  stage: string | null;
  website: string | null;
  team_size: number | null;
  address: string | null;
  innovation: string | null;
  business_model: string | null;
  is_visible_in_directory: boolean;
  status: string | null;
  label_granted_at: string | null;
  label_expires_at: string | null;
  doc_rccm: string | null;
  doc_tax: string | null;
  doc_business_plan: string | null;
  doc_statutes: string | null;
  doc_cv: string | null;
  doc_pitch: string | null;
}

const SECTORS = [
  { value: 'fintech', label: 'FinTech' },
  { value: 'edtech', label: 'EdTech' },
  { value: 'healthtech', label: 'HealthTech' },
  { value: 'agritech', label: 'AgriTech' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'mobility', label: 'Mobilité' },
  { value: 'cleantech', label: 'CleanTech' },
  { value: 'proptech', label: 'PropTech' },
  { value: 'other', label: 'Autre' },
];

const STAGES = [
  { value: 'idea', label: 'Idéation' },
  { value: 'mvp', label: 'MVP' },
  { value: 'early', label: 'Early Stage' },
  { value: 'growth', label: 'Growth' },
  { value: 'scale', label: 'Scale-up' },
];

const DOCUMENT_LABELS: Record<string, string> = {
  doc_rccm: 'RCCM',
  doc_tax: 'Attestation fiscale',
  doc_business_plan: 'Business Plan',
  doc_statutes: 'Statuts',
  doc_cv: 'CV Fondateurs',
  doc_pitch: 'Pitch Deck',
};

export default function StartupProfile() {
  const { user } = useAuth();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingDoc, setLoadingDoc] = useState<string | null>(null);
  
  // Hook pour accès sécurisé aux documents
  const { getSignedUrl, downloadDocument } = useSecureDocument();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      description: '',
      sector: '',
      stage: '',
      website: '',
      team_size: 1,
      address: '',
      innovation: '',
      business_model: '',
      is_visible_in_directory: true,
    },
  });

  const fetchStartup = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('startups')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setStartup(data);
        form.reset({
          name: data.name || '',
          description: data.description || '',
          sector: data.sector || '',
          stage: data.stage || '',
          website: data.website || '',
          team_size: data.team_size || 1,
          address: data.address || '',
          innovation: data.innovation || '',
          business_model: data.business_model || '',
          is_visible_in_directory: data.is_visible_in_directory ?? true,
        });
      }
    } catch (error) {
      console.error('Error fetching startup:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les informations de la startup.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartup();
  }, [user]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!startup) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('startups')
        .update({
          name: data.name,
          description: data.description,
          sector: data.sector,
          stage: data.stage,
          website: data.website || null,
          team_size: data.team_size,
          address: data.address || null,
          innovation: data.innovation || null,
          business_model: data.business_model || null,
          is_visible_in_directory: data.is_visible_in_directory,
        })
        .eq('id', startup.id);

      if (error) throw error;

      toast({
        title: 'Profil mis à jour',
        description: 'Les informations de votre startup ont été enregistrées.',
      });

      setIsEditing(false);
      fetchStartup();
    } catch (error: unknown) {
      console.error('Error updating startup:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de mettre à jour le profil.',
      });
    } finally {
      setSaving(false);
    }
  };

  const documents = startup ? [
    { key: 'doc_rccm', value: startup.doc_rccm },
    { key: 'doc_tax', value: startup.doc_tax },
    { key: 'doc_business_plan', value: startup.doc_business_plan },
    { key: 'doc_statutes', value: startup.doc_statutes },
    { key: 'doc_cv', value: startup.doc_cv },
    { key: 'doc_pitch', value: startup.doc_pitch },
  ] : [];

  const handleDocumentPreview = async (path: string, docKey: string) => {
    setLoadingDoc(docKey);
    try {
      const signedUrl = await getSignedUrl(path, 'preview');
      if (signedUrl) {
        if (isPreviewable(path)) {
          window.open(signedUrl, '_blank');
        } else {
          window.open(signedUrl, '_blank');
        }
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible d\'ouvrir le document.',
      });
    } finally {
      setLoadingDoc(null);
    }
  };

  const handleDocumentDownload = async (path: string, docKey: string) => {
    setLoadingDoc(docKey);
    try {
      const fileName = path.split('/').pop() || 'document';
      await downloadDocument(path, fileName);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de télécharger le document.',
      });
    } finally {
      setLoadingDoc(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12 bg-muted/30 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <Card className="max-w-lg mx-auto text-center p-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Aucune startup trouvée</h2>
              <p className="text-muted-foreground mb-4">
                Vous n'avez pas encore créé de profil de startup.
              </p>
              <Button onClick={() => window.location.href = '/postuler'}>
                Créer ma startup
              </Button>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Building2 className="h-6 w-6" />
                  {startup.name}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  {startup.status === 'labeled' && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Labellisée
                    </Badge>
                  )}
                  {startup.sector && (
                    <Badge variant="outline">
                      {SECTORS.find(s => s.value === startup.sector)?.label || startup.sector}
                    </Badge>
                  )}
                </div>
              </div>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)}>
                  Modifier
                </Button>
              )}
            </div>

            <Tabs defaultValue="info" className="space-y-4">
              <TabsList>
                <TabsTrigger value="info" className="gap-2">
                  <Building2 className="h-4 w-4" />
                  Informations
                </TabsTrigger>
                <TabsTrigger value="documents" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="settings" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Paramètres
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations de la startup</CardTitle>
                    <CardDescription>
                      {isEditing 
                        ? 'Modifiez les informations de votre startup'
                        : 'Consultez les informations de votre startup'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom de la startup</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="sector"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Secteur</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  value={field.value}
                                  disabled={!isEditing}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {SECTORS.map((sector) => (
                                      <SelectItem key={sector.value} value={sector.value}>
                                        {sector.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="stage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Stade</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  value={field.value}
                                  disabled={!isEditing}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {STAGES.map((stage) => (
                                      <SelectItem key={stage.value} value={stage.value}>
                                        {stage.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  disabled={!isEditing}
                                  rows={4}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Site web</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                      {...field} 
                                      disabled={!isEditing}
                                      className="pl-10"
                                      placeholder="https://..."
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="team_size"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Taille de l'équipe</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                      {...field} 
                                      type="number"
                                      disabled={!isEditing}
                                      className="pl-10"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Adresse</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input 
                                    {...field} 
                                    disabled={!isEditing}
                                    className="pl-10"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Separator />

                        <FormField
                          control={form.control}
                          name="innovation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Innovation</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  disabled={!isEditing}
                                  rows={3}
                                  placeholder="Décrivez votre innovation..."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="business_model"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Modèle économique</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  disabled={!isEditing}
                                  rows={3}
                                  placeholder="Décrivez votre modèle économique..."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {isEditing && (
                          <div className="flex gap-2 justify-end">
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => {
                                setIsEditing(false);
                                fetchStartup();
                              }}
                            >
                              Annuler
                            </Button>
                            <Button type="submit" disabled={saving}>
                              {saving ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Enregistrement...
                                </>
                              ) : (
                                <>
                                  <Save className="h-4 w-4 mr-2" />
                                  Enregistrer
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>Documents</CardTitle>
                    <CardDescription>
                      Documents téléversés lors de votre candidature. Les liens sécurisés expirent après 5 minutes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {documents.map(({ key, value }) => (
                        <div 
                          key={key}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">
                              {DOCUMENT_LABELS[key] || key}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {value ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDocumentPreview(value, key)}
                                  disabled={loadingDoc === key}
                                  className="h-8"
                                >
                                  {loadingDoc === key ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : isPreviewable(value) ? (
                                    <>
                                      <Eye className="h-4 w-4 mr-1" />
                                      Voir
                                    </>
                                  ) : (
                                    <>
                                      <ExternalLink className="h-4 w-4 mr-1" />
                                      Ouvrir
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDocumentDownload(value, key)}
                                  disabled={loadingDoc === key}
                                  className="h-8"
                                >
                                  {loadingDoc === key ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <>
                                      <Download className="h-4 w-4 mr-1" />
                                      Télécharger
                                    </>
                                  )}
                                </Button>
                                <Badge variant="outline" className="text-green-600 border-green-300">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Fourni
                                </Badge>
                              </>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">
                                <XCircle className="h-3 w-3 mr-1" />
                                Non fourni
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres de visibilité</CardTitle>
                    <CardDescription>
                      Gérez la visibilité de votre startup dans l'annuaire
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                          control={form.control}
                          name="is_visible_in_directory"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base flex items-center gap-2">
                                  {field.value ? (
                                    <Eye className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  Visible dans l'annuaire
                                </FormLabel>
                                <FormDescription>
                                  Votre startup sera visible publiquement dans l'annuaire des startups labellisées
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked);
                                    form.handleSubmit(onSubmit)();
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                {/* Apparence */}
                <Card>
                  <CardHeader>
                    <CardTitle>Apparence</CardTitle>
                    <CardDescription>
                      Personnalisez l'affichage de l'interface
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ThemeToggle />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
