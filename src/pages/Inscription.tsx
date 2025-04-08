
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";

const Inscription = () => {
  const [userType, setUserType] = useState("startup");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Compte créé avec succès",
        description: "Veuillez vérifier votre email pour activer votre compte.",
      });
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Créer un compte</h1>
              <p className="text-gray-600">
                Rejoignez l'écosystème des startups numériques en Côte d'Ivoire
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <Label className="mb-2 block">Type de compte</Label>
                <RadioGroup 
                  value={userType} 
                  onValueChange={setUserType}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="startup" id="startup" />
                    <Label htmlFor="startup">Startup</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="structure" id="structure" />
                    <Label htmlFor="structure">Structure d'accompagnement</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="investor" id="investor" />
                    <Label htmlFor="investor">Investisseur</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstname">Prénom</Label>
                    <Input id="firstname" type="text" required />
                  </div>
                  <div>
                    <Label htmlFor="lastname">Nom</Label>
                    <Input id="lastname" type="text" required />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required />
                </div>
                
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" type="tel" required />
                </div>
                
                {userType === "startup" && (
                  <div>
                    <Label htmlFor="company">Nom de la startup</Label>
                    <Input id="company" type="text" required />
                  </div>
                )}
                
                {userType === "structure" && (
                  <div>
                    <Label htmlFor="structureName">Nom de la structure d'accompagnement</Label>
                    <Input id="structureName" type="text" required />
                  </div>
                )}
                
                {userType === "investor" && (
                  <div>
                    <Label htmlFor="investorName">Nom de l'organisation d'investissement</Label>
                    <Input id="investorName" type="text" required />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input id="password" type="password" required />
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input id="confirmPassword" type="password" required />
                </div>
              </div>
              
              <div className="mt-6">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Création en cours..." : "Créer un compte"}
                </Button>
              </div>
              
              <div className="mt-4 text-center text-sm text-gray-500">
                En créant un compte, vous acceptez nos{" "}
                <Link to="/mentions-legales" className="text-ivoire-orange hover:underline">
                  Conditions d'utilisation
                </Link>{" "}
                et notre{" "}
                <Link to="/confidentialite" className="text-ivoire-orange hover:underline">
                  Politique de confidentialité
                </Link>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Vous avez déjà un compte ?{" "}
                  <Link to="/connexion" className="text-ivoire-orange hover:underline font-medium">
                    Connectez-vous
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Inscription;
