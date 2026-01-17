import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Adresse email invalide").min(1, "L'email est requis"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
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
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
      setActiveTab("login");
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

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-muted/30 via-background to-muted/50">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <span className="text-2xl font-bold text-primary">S</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Startup Label Ivoire</h1>
            <p className="text-muted-foreground mt-2">
              L'écosystème des startups numériques en Côte d'Ivoire
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <Alert variant="destructive" className="mb-4 animate-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-500 bg-green-50 text-green-800 animate-in slide-in-from-top-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-4">
              <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as "login" | "signup"); clearMessages(); }}>
                <TabsList className="grid w-full grid-cols-2 h-12">
                  <TabsTrigger value="login" className="text-sm font-medium">
                    Connexion
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="text-sm font-medium">
                    Inscription
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-6 space-y-4">
                  <CardTitle className="text-xl">Bon retour !</CardTitle>
                  <CardDescription>
                    Connectez-vous pour accéder à votre espace
                  </CardDescription>
                  
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  {...field} 
                                  type="email" 
                                  placeholder="votre@email.com"
                                  className="pl-10"
                                  disabled={isLoading}
                                />
                              </div>
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
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  {...field} 
                                  type="password" 
                                  placeholder="••••••••"
                                  className="pl-10"
                                  disabled={isLoading}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full h-11 font-medium"
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
                </TabsContent>

                <TabsContent value="signup" className="mt-6 space-y-4">
                  <CardTitle className="text-xl">Créer un compte</CardTitle>
                  <CardDescription>
                    Rejoignez l'écosystème startup ivoirien
                  </CardDescription>
                  
                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={signupForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prénom</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input 
                                    {...field} 
                                    placeholder="Jean"
                                    className="pl-10"
                                    disabled={isLoading}
                                  />
                                </div>
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
                              <FormLabel>Nom</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="Dupont"
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
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  {...field} 
                                  type="email" 
                                  placeholder="votre@email.com"
                                  className="pl-10"
                                  disabled={isLoading}
                                />
                              </div>
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
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  {...field} 
                                  type="password" 
                                  placeholder="••••••••"
                                  className="pl-10"
                                  disabled={isLoading}
                                />
                              </div>
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
                            <FormLabel>Confirmer le mot de passe</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  {...field} 
                                  type="password" 
                                  placeholder="••••••••"
                                  className="pl-10"
                                  disabled={isLoading}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full h-11 font-medium"
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
                      
                      <p className="text-xs text-center text-muted-foreground">
                        En créant un compte, vous acceptez nos{" "}
                        <Link to="/mentions-legales" className="text-primary hover:underline">
                          CGU
                        </Link>{" "}
                        et notre{" "}
                        <Link to="/confidentialite" className="text-primary hover:underline">
                          politique de confidentialité
                        </Link>
                      </p>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>

          {/* Back to home */}
          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}