import { useState } from "react";
import { motion } from "framer-motion";
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  FileQuestion,
  ChevronDown,
  Send,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const FAQ_ITEMS = [
  {
    question: "Comment puis-je modifier mon dossier de candidature ?",
    answer:
      "Vous pouvez modifier votre dossier tant qu'il est en statut 'Brouillon'. Une fois soumis, vous ne pourrez plus le modifier directement. Si vous avez besoin de faire des changements après soumission, contactez notre équipe via la messagerie.",
  },
  {
    question: "Combien de temps prend l'évaluation de mon dossier ?",
    answer:
      "Le processus d'évaluation prend généralement entre 2 et 4 semaines après la soumission complète de votre dossier. Vous serez notifié à chaque étape du processus.",
  },
  {
    question: "Quels documents sont obligatoires pour postuler ?",
    answer:
      "Les documents obligatoires sont : le RCCM (Registre de Commerce), les statuts de l'entreprise, le business plan et les CV des fondateurs. Le pitch deck et l'attestation fiscale sont optionnels mais recommandés.",
  },
  {
    question: "Comment renouveler mon label ?",
    answer:
      "Le label est valable 2 ans. Vous recevrez une notification 3 mois avant l'expiration pour initier la procédure de renouvellement. Vous pourrez alors soumettre un dossier de renouvellement simplifié.",
  },
  {
    question: "Quels sont les avantages du Label Startup Numérique ?",
    answer:
      "Le label offre de nombreux avantages : accès à des financements préférentiels, accompagnement personnalisé, mise en réseau avec des investisseurs, visibilité accrue, et accès à des ressources exclusives.",
  },
  {
    question: "Puis-je candidater si ma startup n'est pas encore immatriculée ?",
    answer:
      "Non, l'immatriculation au RCCM est une condition préalable obligatoire. Votre startup doit être légalement constituée en Côte d'Ivoire pour être éligible au label.",
  },
];

const CONTACT_SUBJECTS = [
  { value: "dossier", label: "Question sur mon dossier" },
  { value: "technique", label: "Problème technique" },
  { value: "documents", label: "Documents requis" },
  { value: "label", label: "Questions sur le label" },
  { value: "autre", label: "Autre demande" },
];

export default function Support() {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject || !formData.message) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: profile?.full_name || "Utilisateur",
        email: user?.email || "",
        subject: CONTACT_SUBJECTS.find((s) => s.value === formData.subject)?.label || formData.subject,
        message: formData.message,
      });

      if (error) throw error;

      toast.success("Votre message a été envoyé. Nous vous répondrons rapidement.");
      setFormData({ subject: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Support</h1>
        <p className="text-muted-foreground">
          Trouvez des réponses à vos questions ou contactez notre équipe
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardContent className="pt-6">
            <Link to="/startup/messages" className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Messagerie</h3>
                <p className="text-sm text-muted-foreground">Discutez avec notre équipe</p>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardContent className="pt-6">
            <a href="tel:+22527200000" className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Phone className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold">Téléphone</h3>
                <p className="text-sm text-muted-foreground">+225 27 20 00 00</p>
              </div>
            </a>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardContent className="pt-6">
            <a href="mailto:support@label-startup.ci" className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-sm text-muted-foreground">support@label-startup.ci</p>
              </div>
            </a>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileQuestion className="w-5 h-5" />
              Questions fréquentes
            </CardTitle>
            <CardDescription>
              Les réponses aux questions les plus courantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {FAQ_ITEMS.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-6 pt-6 border-t">
              <Link to="/faq" className="inline-flex items-center gap-2 text-primary hover:underline">
                Voir toutes les FAQ
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Nous contacter
            </CardTitle>
            <CardDescription>
              Envoyez-nous un message et nous vous répondrons rapidement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Sujet de votre demande</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) => setFormData({ ...formData, subject: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un sujet" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTACT_SUBJECTS.map((subject) => (
                      <SelectItem key={subject.value} value={subject.value}>
                        {subject.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Votre message</Label>
                <Textarea
                  id="message"
                  placeholder="Décrivez votre demande en détail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                />
              </div>

              <Button type="submit" className="w-full" disabled={sending}>
                <Send className="w-4 h-4 mr-2" />
                {sending ? "Envoi en cours..." : "Envoyer le message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Help Banner */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Besoin d'aide supplémentaire ?</h3>
                <p className="text-sm text-muted-foreground">
                  Consultez notre guide complet du processus de labellisation
                </p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link to="/criteres">
                Voir les critères
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
