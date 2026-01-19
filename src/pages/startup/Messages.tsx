import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Send, 
  Inbox, 
  CheckCheck,
  Clock,
  User,
  Building2,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useStartupMessages } from "@/hooks/useStartupMessages";
import { PushPermissionBanner } from "@/components/notifications/PushPermissionBanner";

export default function Messages() {
  const { user } = useAuth();
  const {
    messages,
    loading,
    error,
    sendMessage,
    institutionOnline,
    typingUsers,
    setTyping,
    markAsRead,
    applicationId,
  } = useStartupMessages();

  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastTypingRef = useRef<number>(0);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Mark messages as read when viewing
  useEffect(() => {
    markAsRead();
  }, [markAsRead]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !applicationId) return;

    setSending(true);
    setTyping(false);
    
    const success = await sendMessage(newMessage.trim());
    
    if (success) {
      setNewMessage("");
      toast.success("Message envoyé");
    } else {
      toast.error("Erreur lors de l'envoi du message");
    }
    
    setSending(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    
    // Throttle typing indicator
    const now = Date.now();
    if (now - lastTypingRef.current > 1000) {
      setTyping(true);
      lastTypingRef.current = now;
    }
  };

  const isOwnMessage = (userId: string) => user?.id === userId;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!applicationId) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Inbox className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Aucun dossier trouvé</h2>
        <p className="text-muted-foreground">
          Vous devez d'abord créer un dossier de candidature pour accéder à la messagerie.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[calc(100vh-12rem)] flex flex-col gap-4"
    >
      {/* Push Permission Banner */}
      <PushPermissionBanner />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground">
          Échangez avec l'équipe de labellisation concernant votre dossier
        </p>
      </div>

      {/* Messages Card */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Équipe de Labellisation</CardTitle>
                <CardDescription>Ministère de l'Économie Numérique</CardDescription>
              </div>
            </div>
            <Badge 
              variant={institutionOnline ? "success" : "secondary"} 
              className="gap-1"
            >
              {institutionOnline ? (
                <>
                  <Wifi className="w-3 h-3" />
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  En ligne
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3" />
                  Hors ligne
                </>
              )}
            </Badge>
          </div>
        </CardHeader>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Aucun message</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Démarrez une conversation avec l'équipe de labellisation concernant votre dossier.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => {
                const isOwn = isOwnMessage(message.user_id);
                const showDate =
                  index === 0 ||
                  format(new Date(message.created_at), "yyyy-MM-dd") !==
                    format(new Date(messages[index - 1].created_at), "yyyy-MM-dd");

                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="flex items-center justify-center my-4">
                        <Separator className="flex-1" />
                        <span className="px-3 text-xs text-muted-foreground">
                          {format(new Date(message.created_at), "d MMMM yyyy", { locale: fr })}
                        </span>
                        <Separator className="flex-1" />
                      </div>
                    )}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={isOwn ? "bg-primary text-primary-foreground" : "bg-muted"}>
                          {isOwn ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          isOwn
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-muted rounded-tl-none"
                        }`}
                      >
                        {!isOwn && message.author?.full_name && (
                          <p className="text-xs font-medium mb-1 opacity-70">
                            {message.author.full_name}
                          </p>
                        )}
                        <p className="text-sm">{message.content}</p>
                        <div
                          className={`flex items-center gap-1 mt-1 text-xs ${
                            isOwn ? "text-primary-foreground/70 justify-end" : "text-muted-foreground"
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {format(new Date(message.created_at), "HH:mm")}
                          {isOwn && <CheckCheck className="w-3 h-3 ml-1" />}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {typingUsers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span>{typingUsers.join(", ")} écrit...</span>
                </motion.div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="Écrivez votre message..."
              value={newMessage}
              onChange={handleInputChange}
              className="min-h-[60px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              onBlur={() => setTyping(false)}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              className="self-end"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Appuyez sur Entrée pour envoyer, Shift+Entrée pour un saut de ligne
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
