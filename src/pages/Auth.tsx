import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock, AlertCircle, CheckCircle2, ArrowLeft, Rocket } from "lucide-react";
import { motion } from "framer-motion";

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Adresse email invalide").min(1, "L'email est requis"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  rememberMe: z.boolean().optional(),
});

const signupSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères").max(50, "Le prénom est trop long"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(50, "Le nom est trop long"),
  email: z.string().email("Adresse email invalide").min(1, "L'email est requis"),
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSignup, setShowSignup] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await signIn(data.email, data.password);
      navigate("/");
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await signUp(data.email, data.password, {
        firstName: data.firstName,
        lastName: data.lastName,
      });
      setSuccess("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
      setShowSignup(false);
      signupForm.reset();
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (err: any): string => {
    const message = err?.message?.toLowerCase() || "";
    
    if (message.includes("invalid login credentials")) {
      return "Email ou mot de passe incorrect";
    }
    if (message.includes("email already registered") || message.includes("user already registered")) {
      return "Cette adresse email est déjà utilisée";
    }
    if (message.includes("invalid email")) {
      return "Adresse email invalide";
    }
    if (message.includes("weak password")) {
      return "Le mot de passe est trop faible";
    }
    if (message.includes("network") || message.includes("fetch")) {
      return "Erreur de connexion. Vérifiez votre connexion internet.";
    }
    
    return err?.message || "Une erreur est survenue. Veuillez réessayer.";
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Header */}
      <header className="w-full py-4 px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative">
            <Rocket className="w-8 h-8 text-primary transform -rotate-45" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent rounded-full" />
          </div>
          <span className="text-lg font-heading">
            <span className="font-bold text-primary">Startup Label</span>
            <span className="text-muted-foreground"> – Ivoire Hub</span>
          </span>
        </Link>
        
        <Link 
          to="/" 
          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>
      </header>
      
      <main className="flex-grow flex items-center justify-center py-8 px-4">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Alerts */}
          {error && (
            <Alert variant="destructive" className="mb-4 animate-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-success bg-success/10 text-success animate-in slide-in-from-top-2">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Main Login Card */}
          <Card className="border shadow-lg bg-card">
            <CardContent className="pt-8 pb-6 px-8">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Connexion à la plateforme
                </h1>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>Plateforme officielle – données sécurisées</span>
                </div>
              </div>

              {!showSignup ? (
                <>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="email" 
                                placeholder="Adresse email"
                                className="h-12 bg-background border-border"
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="password" 
                                placeholder="Mot de passe"
                                className="h-12 bg-background border-border"
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center justify-between">
                        <FormField
                          control={loginForm.control}
                          name="rememberMe"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2 space-y-0">
                              <FormControl>
                                <Checkbox 
                                  checked={field.value} 
                                  onCheckedChange={field.onChange}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <label className="text-sm text-muted-foreground cursor-pointer">
                                Se souvenir de moi
                              </label>
                            </FormItem>
                          )}
                        />
                        
                        <Link 
                          to="/mot-de-passe-oublie" 
                          className="text-sm text-primary hover:underline"
                        >
                          Mot de passe oublié ?
                        </Link>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-12 font-medium bg-primary hover:bg-primary/90"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Connexion...
                          </>
                        ) : (
                          "Se connecter"
                        )}
                      </Button>
                    </form>
                  </Form>

                  <Button 
                    variant="outline" 
                    className="w-full h-12 mt-3 font-medium border-border"
                    onClick={() => { setShowSignup(true); setError(null); }}
                  >
                    Créer un compte startup
                  </Button>
                </>
              ) : (
                <>
                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={signupForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="Prénom"
                                  className="h-12 bg-background border-border"
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={signupForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="Nom"
                                  className="h-12 bg-background border-border"
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={signupForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="email" 
                                placeholder="Adresse email"
                                className="h-12 bg-background border-border"
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={signupForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="password" 
                                placeholder="Mot de passe"
                                className="h-12 bg-background border-border"
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-muted-foreground">
                              8 caractères min., 1 majuscule, 1 minuscule, 1 chiffre
                            </p>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={signupForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="password" 
                                placeholder="Confirmer le mot de passe"
                                className="h-12 bg-background border-border"
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full h-12 font-medium bg-primary hover:bg-primary/90"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Création...
                          </>
                        ) : (
                          "Créer mon compte"
                        )}
                      </Button>
                    </form>
                  </Form>

                  <Button 
                    variant="outline" 
                    className="w-full h-12 mt-3 font-medium border-border"
                    onClick={() => { setShowSignup(false); setError(null); }}
                  >
                    J'ai déjà un compte
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Startup CTA Card */}
          <Card className="mt-4 border shadow-lg bg-card">
            <CardContent className="py-6 px-8 text-center">
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Vous êtes une startup ?
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Créez un compte pour déposer votre dossier de labellisation.
              </p>
              <Button 
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium px-6"
                onClick={() => { setShowSignup(true); setError(null); }}
              >
                Inscrire ma startup
              </Button>
            </CardContent>
          </Card>

          {/* Footer Links */}
          <div className="text-center mt-6 text-sm text-muted-foreground">
            <Link to="/mentions-legales" className="hover:text-primary transition-colors">
              Conditions d'utilisation
            </Link>
            <span className="mx-2">·</span>
            <Link to="/confidentialite" className="hover:text-primary transition-colors">
              Politique de confidentialité
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
