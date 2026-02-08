import { useState } from "react";
import { Mail, Send, CheckCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const NewsletterBanner = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      toast({
        title: "Email invalide",
        description: "Veuillez entrer une adresse email valide.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers" as any)
        .insert({ email, source: "actualites" } as any);

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Déjà inscrit",
            description: "Cette adresse email est déjà enregistrée.",
          });
        } else {
          throw error;
        }
      } else {
        setIsSubscribed(true);
        toast({
          title: "Inscription réussie ! 🎉",
          description: "Vous recevrez nos prochaines actualités par email.",
        });
      }
    } catch (err) {
      console.error("Newsletter subscription error:", err);
      toast({
        title: "Erreur",
        description: "Impossible de s'inscrire pour le moment. Réessayez plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <section className="bg-gradient-to-r from-ci-orange/10 via-ci-green/10 to-ci-orange/5 border-y border-border/50">
        <div className="container mx-auto px-4 py-10 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <CheckCircle className="h-10 w-10 text-ci-green" />
            <h3 className="text-xl font-bold text-foreground">
              Merci pour votre inscription !
            </h3>
            <p className="text-muted-foreground text-sm">
              Vous recevrez les dernières actualités de l'écosystème Tech CI directement dans votre boîte mail.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-r from-ci-orange/10 via-ci-green/10 to-ci-orange/5 border-y border-border/50">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          <div className="flex items-start gap-4 flex-1">
            <div className="bg-ci-orange/15 p-3 rounded-xl shrink-0 hidden sm:block">
              <Mail className="h-6 w-6 text-ci-orange" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-foreground">
                Ne manquez rien de l'actu Tech CI
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Recevez les dernières nouvelles de l'écosystème startup ivoirien, chaque semaine.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex gap-2 w-full md:w-auto md:min-w-[360px]"
          >
            <Input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              required
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-ci-orange hover:bg-ci-orange/90 text-white gap-2 shrink-0"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              S'inscrire
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterBanner;
