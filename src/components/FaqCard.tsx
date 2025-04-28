
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const FaqCard = () => {
  return (
    <Card className="bg-gray-50 border-ivoire-orange/20 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl gap-2">
          <HelpCircle className="h-5 w-5 text-ivoire-orange" />
          Questions fréquentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          Vous avez des questions concernant le Label Startup, le processus de candidature ou les avantages offerts ?
        </p>
        <Button variant="outline" asChild>
          <Link to="/faq" className="w-full">
            Consulter notre FAQ
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default FaqCard;
