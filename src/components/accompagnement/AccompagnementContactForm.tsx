import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const structures = [
  "Orange Digital Center",
  "Incub'Ivoire",
  "Seedstars Abidjan",
  "Yamoussoukro Tech Hub",
  "CIV Innovation Lab",
  "Entrepreneurs Factory",
];

const formSchema = z.object({
  startupName: z.string().min(2, "Nom requis").max(100),
  email: z.string().email("Email invalide"),
  structureName: z.string().min(1, "Sélectionnez une structure"),
  message: z.string().min(20, "Le message doit contenir au moins 20 caractères").max(1000),
});

type FormData = z.infer<typeof formSchema>;

export function AccompagnementContactForm() {
  const { user, profile } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startupName: "",
      email: profile?.email || "",
      structureName: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({ title: "Connexion requise", description: "Connectez-vous pour envoyer une demande.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("accompaniment_requests").insert({
        user_id: user.id,
        startup_name: data.startupName,
        email: data.email,
        structure_name: data.structureName,
        message: data.message,
      });

      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible d'envoyer la demande. Réessayez.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-primary/20">
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Demande envoyée !</h3>
          <p className="text-muted-foreground">
            Votre demande a été transmise. La structure vous contactera prochainement.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5 text-primary" />
          Contacter une structure
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!user && (
          <Alert className="mb-4">
            <AlertDescription>
              <a href="/auth" className="text-primary hover:underline font-medium">Connectez-vous</a> pour envoyer une demande d'accompagnement.
            </AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="startupName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de votre startup</FormLabel>
                  <FormControl>
                    <Input placeholder="Ma Startup" {...field} disabled={loading} />
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
                  <FormLabel>Email de contact</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="contact@mastartup.ci" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="structureName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Structure ciblée</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une structure" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {structures.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Votre message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez votre besoin d'accompagnement..."
                      className="min-h-[100px]"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading || !user}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer la demande
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
