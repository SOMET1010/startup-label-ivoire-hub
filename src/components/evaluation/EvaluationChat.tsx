import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Users, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEvaluationComments, Comment, OnlineUser, CommentAuthor } from "@/hooks/useEvaluationComments";
import { CommentThread } from "./CommentThread";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface EvaluationChatProps {
  applicationId: string;
  className?: string;
}

export function EvaluationChat({ applicationId, className }: EvaluationChatProps) {
  const {
    comments,
    loading,
    error,
    sendComment,
    onlineUsers,
    typingUsers,
    setTyping,
    participants,
  } = useEvaluationComments(applicationId);

  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  // Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    setTyping(true);

    // Check for @ mentions
    const lastAtIndex = value.lastIndexOf("@");
    if (lastAtIndex !== -1 && lastAtIndex === value.length - 1) {
      setShowMentions(true);
      setMentionFilter("");
    } else if (lastAtIndex !== -1) {
      const textAfterAt = value.slice(lastAtIndex + 1);
      if (!textAfterAt.includes(" ")) {
        setShowMentions(true);
        setMentionFilter(textAfterAt.toLowerCase());
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  // Insert mention
  const insertMention = (participant: CommentAuthor) => {
    const lastAtIndex = message.lastIndexOf("@");
    const newMessage = message.slice(0, lastAtIndex) + `@${participant.full_name || "Anonyme"} `;
    setMessage(newMessage);
    setShowMentions(false);
    textareaRef.current?.focus();
  };

  // Send message
  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    const success = await sendComment(message.trim());
    if (success) {
      setMessage("");
    }
    setIsSending(false);
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filteredParticipants = participants.filter(p =>
    !mentionFilter || (p.full_name || "").toLowerCase().includes(mentionFilter)
  );

  return (
    <Card className={cn("flex flex-col h-full", className)}>
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Discussion d'évaluation
          </CardTitle>
          <OnlineIndicator users={onlineUsers} />
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Comments list */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {loading ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              Chargement des commentaires...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-32 text-destructive">
              {error}
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <MessageCircle className="h-8 w-8 mb-2 opacity-50" />
              <p>Aucun commentaire pour le moment</p>
              <p className="text-sm">Démarrez la discussion !</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentThread key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="px-4 py-2 text-sm text-muted-foreground border-t bg-muted/30">
            <span className="flex items-center gap-2">
              <span className="flex gap-1">
                <Circle className="h-2 w-2 fill-current animate-pulse" />
                <Circle className="h-2 w-2 fill-current animate-pulse delay-75" />
                <Circle className="h-2 w-2 fill-current animate-pulse delay-150" />
              </span>
              {typingUsers.join(", ")} {typingUsers.length === 1 ? "écrit" : "écrivent"}...
            </span>
          </div>
        )}

        {/* Message input */}
        <div className="p-4 border-t relative">
          {/* Mentions dropdown */}
          {showMentions && filteredParticipants.length > 0 && (
            <div className="absolute bottom-full left-4 right-4 mb-1 bg-popover border rounded-md shadow-lg max-h-40 overflow-auto z-10">
              {filteredParticipants.map((p) => (
                <button
                  key={p.user_id}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent text-left"
                  onClick={() => insertMention(p)}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={p.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">
                      {(p.full_name || "?")[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{p.full_name || "Anonyme"}</span>
                  {p.role && (
                    <Badge variant="outline" className="ml-auto text-xs">
                      {p.role === "admin" ? "Admin" : "Évaluateur"}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Votre message... (@ pour mentionner)"
              className="resize-none min-h-[60px]"
              rows={2}
            />
            <Button
              onClick={handleSend}
              disabled={!message.trim() || isSending}
              size="icon"
              className="shrink-0 h-[60px] w-[60px]"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Online indicator component
function OnlineIndicator({ users }: { users: OnlineUser[] }) {
  if (users.length === 0) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {users.slice(0, 3).map((user) => (
                <Avatar key={user.user_id} className="h-7 w-7 border-2 border-background">
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    {user.full_name?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
              ))}
              {users.length > 3 && (
                <div className="h-7 w-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                  +{users.length - 3}
                </div>
              )}
            </div>
            <Badge variant="secondary" className="gap-1">
              <Circle className="h-2 w-2 fill-green-500 text-green-500" />
              {users.length} en ligne
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            {users.map((user) => (
              <div key={user.user_id} className="flex items-center gap-2">
                <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                <span>{user.full_name}</span>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
