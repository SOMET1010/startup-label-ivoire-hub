import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  title: string;
  preview: string;
  date: string;
  isUnread: boolean;
}

interface InstitutionMessagesCardProps {
  messages?: Message[];
  unreadCount?: number;
  className?: string;
}

export function InstitutionMessagesCard({
  messages = [],
  unreadCount = 0,
  className,
}: InstitutionMessagesCardProps) {
  const hasMessages = messages.length > 0 || unreadCount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <Card className={cn("h-full flex flex-col", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            Messages de l'institution
            {unreadCount > 0 && (
              <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-accent text-accent-foreground rounded-full">
                {unreadCount}
              </span>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          {hasMessages ? (
            <>
              <div className="flex-1 space-y-3">
                {messages.length > 0 ? (
                  messages.slice(0, 3).map((message, index) => (
                    <div
                      key={message.id}
                      className={cn(
                        "p-3 rounded-lg border transition-colors",
                        message.isUnread
                          ? "bg-primary/5 border-primary/20"
                          : "bg-muted/30 border-transparent"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={cn(
                            "p-1.5 rounded-full mt-0.5",
                            message.isUnread ? "bg-primary/20" : "bg-muted"
                          )}
                        >
                          <MessageSquare
                            className={cn(
                              "h-3 w-3",
                              message.isUnread ? "text-primary" : "text-muted-foreground"
                            )}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{message.title}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {message.preview}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-full bg-primary/20">
                        <MessageSquare className="h-3 w-3 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {unreadCount} commentaire{unreadCount > 1 ? "s" : ""} du comité
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Consultez votre dossier
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button
                asChild
                variant="ghost"
                size="sm"
                className="mt-4 w-full justify-center text-primary hover:text-primary hover:bg-primary/10"
              >
                <Link to="/startup/suivi">
                  Voir les messages
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
              <div className="p-3 rounded-full bg-muted mb-3">
                <Mail className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Aucun message pour le moment
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default InstitutionMessagesCard;
