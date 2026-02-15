import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Building2, FileText, Settings, Loader2, CheckCircle } from 'lucide-react';
import { SECTORS } from '@/lib/constants/startup';
import { useStartupProfile } from '@/hooks/useStartupProfile';
import ProfileInfoTab from '@/components/startup/ProfileInfoTab';
import ProfileDocumentsTab from '@/components/startup/ProfileDocumentsTab';
import ProfileSettingsTab from '@/components/startup/ProfileSettingsTab';

export default function StartupProfile() {
  const {
    startup,
    loading,
    saving,
    isEditing,
    setIsEditing,
    loadingDoc,
    form,
    documents,
    onSubmit,
    handleDocumentPreview,
    handleDocumentDownload,
    fetchStartup,
  } = useStartupProfile();

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
                <ProfileInfoTab
                  form={form}
                  isEditing={isEditing}
                  saving={saving}
                  onSubmit={onSubmit}
                  onCancel={() => {
                    setIsEditing(false);
                    fetchStartup();
                  }}
                />
              </TabsContent>

              <TabsContent value="documents">
                <ProfileDocumentsTab
                  documents={documents}
                  loadingDoc={loadingDoc}
                  onPreview={handleDocumentPreview}
                  onDownload={handleDocumentDownload}
                />
              </TabsContent>

              <TabsContent value="settings">
                <ProfileSettingsTab
                  form={form}
                  onSubmit={onSubmit}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
