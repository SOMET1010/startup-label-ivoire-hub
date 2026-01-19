import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, ArrowLeft, CheckCircle, Rocket, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, "8 caractères minimum")
    .regex(/[A-Z]/, "Une majuscule requise")
    .regex(/[a-z]/, "Une minuscule requise")
    .regex(/[0-9]/, "Un chiffre requis"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" }
  });

  const password = form.watch("password");

  // Vérifier si la session est valide (l'utilisateur a cliqué sur le lien email)
  useEffect(() => {
    if (!supabase) {
      setIsValidSession(false);
      return;
    }

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsValidSession(!!session);
    };

    checkSession();

    // Écouter les changements d'auth (quand le lien email est cliqué)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsValidSession(true);
      } else if (session) {
        setIsValidSession(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!supabase) {
      setError("Service non disponible. Veuillez réessayer plus tard.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password
      });

      if (updateError) {
        if (updateError.message.includes("same password")) {
          setError("Le nouveau mot de passe doit être différent de l'ancien.");
        } else if (updateError.message.includes("session")) {
          setError("Session expirée. Veuillez demander un nouveau lien de récupération.");
        } else {
          setError("Une erreur est survenue. Veuillez réessayer.");
        }
      } else {
        setIsSuccess(true);
        // Déconnexion pour forcer une nouvelle connexion avec le nouveau mot de passe
        await supabase.auth.signOut();
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Calcul de la force du mot de passe
  const getPasswordStrength = (pwd: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score, label: "Faible", color: "bg-destructive" };
    if (score <= 3) return { score, label: "Moyen", color: "bg-yellow-500" };
    if (score <= 4) return { score, label: "Bon", color: "bg-primary" };
    return { score, label: "Excellent", color: "bg-primary" };
  };

  const passwordStrength = getPasswordStrength(password);

  // Affichage pendant la vérification de session
  if (isValidSession === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Session invalide
  if (isValidSession === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex flex-col">
        <header className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Rocket className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg hidden sm:block">Label Startup</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="border-border/50 shadow-xl backdrop-blur-sm max-w-md w-full">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Lien expiré</CardTitle>
              <CardDescription className="text-base">
                Ce lien de récupération a expiré ou n'est pas valide.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Les liens de récupération expirent après 1 heure pour des raisons de sécurité.
              </p>
              <div className="flex flex-col gap-3">
                <Link to="/mot-de-passe-oublie">
                  <Button className="w-full">Demander un nouveau lien</Button>
                </Link>
                <Link to="/auth">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour à la connexion
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex flex-col">
      {/* Header */}
      <header className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <Rocket className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg hidden sm:block">Label Startup</span>
          </Link>
          <Link 
            to="/auth" 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la connexion
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-border/50 shadow-xl backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                {isSuccess ? (
                  <CheckCircle className="w-8 h-8 text-primary" />
                ) : (
                  <KeyRound className="w-8 h-8 text-primary" />
                )}
              </div>
              <CardTitle className="text-2xl">
                {isSuccess ? "Mot de passe réinitialisé !" : "Nouveau mot de passe"}
              </CardTitle>
              <CardDescription className="text-base">
                {isSuccess 
                  ? "Vous pouvez maintenant vous connecter"
                  : "Choisissez un nouveau mot de passe sécurisé"
                }
              </CardDescription>
            </CardHeader>

            <CardContent>
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <Alert className="bg-primary/5 border-primary/20">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <AlertDescription>
                      Votre mot de passe a été mis à jour avec succès.
                    </AlertDescription>
                  </Alert>

                  <Link to="/auth">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Se connecter
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nouveau mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                disabled={isLoading}
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                          
                          {/* Indicateur de force */}
                          {password && (
                            <div className="space-y-2 mt-2">
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <div
                                    key={i}
                                    className={`h-1 flex-1 rounded-full transition-colors ${
                                      i <= passwordStrength.score 
                                        ? passwordStrength.color 
                                        : "bg-muted"
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Force : {passwordStrength.label}
                              </p>
                            </div>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmer le mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                disabled={isLoading}
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Exigences du mot de passe */}
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p className={password.length >= 8 ? "text-primary" : ""}>
                        {password.length >= 8 ? "✓" : "○"} 8 caractères minimum
                      </p>
                      <p className={/[A-Z]/.test(password) ? "text-primary" : ""}>
                        {/[A-Z]/.test(password) ? "✓" : "○"} Une lettre majuscule
                      </p>
                      <p className={/[a-z]/.test(password) ? "text-primary" : ""}>
                        {/[a-z]/.test(password) ? "✓" : "○"} Une lettre minuscule
                      </p>
                      <p className={/[0-9]/.test(password) ? "text-primary" : ""}>
                        {/[0-9]/.test(password) ? "✓" : "○"} Un chiffre
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Réinitialisation...
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4 mr-2" />
                          Réinitialiser mon mot de passe
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-muted-foreground">
        <p>© 2025 Label Startup Côte d'Ivoire. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
