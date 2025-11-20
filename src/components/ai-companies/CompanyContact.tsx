import { AICompany } from "@/types/aiCompany";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, ExternalLink, Send, Loader2, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface CompanyContactProps {
  company: AICompany;
}

const contactFormSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Le nom est obligatoire")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  
  email: z.string()
    .trim()
    .email("Email invalide")
    .max(255, "L'email ne peut pas dépasser 255 caractères"),
  
  phone: z.string()
    .trim()
    .max(20, "Le téléphone ne peut pas dépasser 20 caractères")
    .optional(),
  
  subject: z.string()
    .trim()
    .min(1, "Le sujet est obligatoire")
    .max(200, "Le sujet ne peut pas dépasser 200 caractères"),
  
  message: z.string()
    .trim()
    .min(10, "Le message doit contenir au moins 10 caractères")
    .max(2000, "Le message ne peut pas dépasser 2000 caractères"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const CompanyContact = ({ company }: CompanyContactProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const messageLength = form.watch("message")?.length || 0;

  const getCharCountColor = () => {
    if (messageLength > 1900) return "text-destructive";
    if (messageLength > 1800) return "text-orange-500";
    return "text-muted-foreground";
  };

  const onSubmit = async (data: ContactFormData) => {
    if (!company.contact) return;
    
    setIsSubmitting(true);
    setIsSuccess(false);
    
    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          ...data,
          companyName: company.name,
          companyEmail: company.contact.email,
        }
      });
      
      if (error) throw error;
      
      setIsSuccess(true);
      toast({
        title: "Message envoyé avec succès !",
        description: "L'entreprise vous répondra dans les meilleurs délais.",
        duration: 5000,
      });
      
      setTimeout(() => {
        form.reset();
        setIsSuccess(false);
      }, 2000);
      
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi:', error);
      
      toast({
        variant: "destructive",
        title: "Erreur d'envoi",
        description: error.message || "Une erreur est survenue. Veuillez réessayer.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!company.contact) return null;
  
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Nous Contacter</h2>
      
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
        {/* Formulaire de contact */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-6">Envoyer un message</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Jean Kouassi" 
                          {...field} 
                          disabled={isSubmitting}
                        />
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
                      <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="Ex: jean.kouassi@email.com" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel"
                          placeholder="Ex: +225 07 XX XX XX XX" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sujet <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Demande de partenariat" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Décrivez votre demande en détail..."
                          className="min-h-[150px] resize-none"
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <div className="flex justify-between items-center">
                        <FormMessage />
                        <span className={`text-xs ${getCharCountColor()}`}>
                          {messageLength} / 2000
                        </span>
                      </div>
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting || isSuccess}
                >
                  {isSuccess ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Message envoyé !
                    </>
                  ) : isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {/* Coordonnées */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-6">Coordonnées</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm text-muted-foreground">Adresse</div>
                  <div className="font-medium">{company.contact.address}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm text-muted-foreground">Téléphone</div>
                  <a 
                    href={`tel:${company.contact.phone}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {company.contact.phone}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <a 
                    href={`mailto:${company.contact.email}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {company.contact.email}
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <Button className="w-full" asChild>
                <a href={company.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visiter le site web
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Carte */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Localisation</h3>
            
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{company.location}</p>
                  <p className="text-xs">Côte d'Ivoire</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CompanyContact;
