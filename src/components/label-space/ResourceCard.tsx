import { FileText, ExternalLink, Download, BookOpen, FileCode, Scale, Wallet, GraduationCap, Crown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LabelResource } from '@/hooks/useResources';

interface ResourceCardProps {
  resource: LabelResource;
}

const categoryConfig = {
  guide: { icon: BookOpen, label: 'Guide', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  template: { icon: FileCode, label: 'Template', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  formation: { icon: GraduationCap, label: 'Formation', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  legal: { icon: Scale, label: 'Juridique', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  finance: { icon: Wallet, label: 'Finance', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
};

export function ResourceCard({ resource }: ResourceCardProps) {
  const config = categoryConfig[resource.category] || categoryConfig.guide;
  const IconComponent = config.icon;

  const handleDownload = () => {
    if (resource.file_url) {
      window.open(resource.file_url, '_blank');
    }
  };

  const handleExternalLink = () => {
    if (resource.external_url) {
      window.open(resource.external_url, '_blank');
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className={`p-2 rounded-lg ${config.color}`}>
            <IconComponent className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2">
            {resource.is_premium && (
              <Badge variant="secondary" className="gap-1">
                <Crown className="h-3 w-3" />
                Premium
              </Badge>
            )}
            <Badge variant="outline" className={config.color}>
              {config.label}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-lg mt-3">{resource.title}</CardTitle>
        {resource.description && (
          <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          {resource.file_url && (
            <Button variant="outline" size="sm" className="gap-2" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              Télécharger
            </Button>
          )}
          {resource.external_url && (
            <Button variant="outline" size="sm" className="gap-2" onClick={handleExternalLink}>
              <ExternalLink className="h-4 w-4" />
              Accéder
            </Button>
          )}
          {!resource.file_url && !resource.external_url && (
            <Button variant="ghost" size="sm" className="gap-2" disabled>
              <FileText className="h-4 w-4" />
              Bientôt disponible
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
