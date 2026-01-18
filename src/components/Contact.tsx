
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageCircle, Phone } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast({
        title: "Message envoyé",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
      setName("");
      setEmail("");
      setMessage("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-muted/50" id="contact">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nous contacter</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Vous avez des questions ou besoin d'assistance concernant le Label Startup ? 
            Notre équipe est à votre disposition.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="form">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="form">
                <MessageCircle className="mr-2 h-4 w-4" />
                Formulaire
              </TabsTrigger>
              <TabsTrigger value="email">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="phone">
                <Phone className="mr-2 h-4 w-4" />
                Téléphone
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="form">
              <Card>
                <CardHeader>
                  <CardTitle>Envoyez-nous un message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                        Nom complet
                      </label>
                      <Input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                        Email
                      </label>
                      <Input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                        placeholder="Votre message..."
                        required
                      />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? "Envoi en cours..." : "Envoyer"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="email">
              <Card>
                <CardHeader>
                  <CardTitle>Nous écrire directement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-ivoire-orange mr-3" />
                      <div>
                        <h3 className="font-medium">Support général</h3>
                        <a href="mailto:contact@ivoirehub.ci" className="text-ivoire-green hover:underline">
                          contact@ivoirehub.ci
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-ivoire-orange mr-3" />
                      <div>
                        <h3 className="font-medium">Candidatures</h3>
                        <a href="mailto:candidature@ivoirehub.ci" className="text-ivoire-green hover:underline">
                          candidature@ivoirehub.ci
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-ivoire-orange mr-3" />
                      <div>
                        <h3 className="font-medium">Partenariats</h3>
                        <a href="mailto:partenariat@ivoirehub.ci" className="text-ivoire-green hover:underline">
                          partenariat@ivoirehub.ci
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="phone">
              <Card>
                <CardHeader>
                  <CardTitle>Appelez-nous</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-ivoire-orange mr-3" />
                      <div>
                        <h3 className="font-medium">Standard</h3>
                        <p className="text-ivoire-green">+225 27 20 30 40 50</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-ivoire-orange mr-3" />
                      <div>
                        <h3 className="font-medium">Support technique</h3>
                        <p className="text-ivoire-green">+225 07 08 09 10 11</p>
                      </div>
                    </div>
                    <div>
                      <p className="mt-4 text-muted-foreground">
                        Disponible du lundi au vendredi de 8h à 17h
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-xl font-bold mb-2">Rendez-nous visite</h3>
          <p className="text-muted-foreground mb-4">
            Deux Plateaux, Rue des Jardins<br />
            Abidjan, Côte d'Ivoire
          </p>
          <div className="aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31893.08418741484!2d-4.035666072617334!3d5.354925721910213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1ea23de4c4afb%3A0x78a3978b571c0779!2sDeux%20Plateaux%2C%20Abidjan%2C%20C%C3%B4te%20d&#39;Ivoire!5e0!3m2!1sfr!2sus!4v1713496260584!5m2!1sfr!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
