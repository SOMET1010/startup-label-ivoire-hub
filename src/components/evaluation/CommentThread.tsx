import { useState } from "react";
import { Reply, Edit2, Check, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Comment } from "@/hooks/useEvaluationComments";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { useEvaluationComments } from "@/hooks/useEvaluationComments";

interface CommentThreadProps {
  comment: Comment;
  isReply?: boolean;
}

export function CommentThread({ comment, isReply = false }: CommentThreadProps) {
  const { user } = useAuth();
  const isOwn = user?.id === comment.user_id;
  
  // Check if editable (within 15 minutes)
  const createdAt = new Date(comment.created_at);
  const now = new Date();
  const isEditable = isOwn && (now.getTime() - createdAt.getTime()) < 15 * 60 * 1000;

  const roleLabel = comment.author?.role === "admin" ? "Admin" : 
                    comment.author?.role === "evaluator" ? "Évaluateur" : null;

  const roleColor = comment.author?.role === "admin" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";

  return (
    <div className={cn("group", isReply && "ml-8 mt-3")}>
      <div className={cn(
        "flex gap-3",
        isOwn && "flex-row-reverse"
      )}>
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={comment.author?.avatar_url || undefined} />
          <AvatarFallback className={cn(
            "text-xs",
            isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
          )}>
            {(comment.author?.full_name || "?")[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className={cn(
          "flex-1 max-w-[80%]",
          isOwn && "flex flex-col items-end"
        )}>
          {/* Header */}
          <div className={cn(
            "flex items-center gap-2 mb-1",
            isOwn && "flex-row-reverse"
          )}>
            <span className="font-medium text-sm">
              {comment.author?.full_name || "Anonyme"}
            </span>
            {roleLabel && (
              <Badge variant="secondary" className={cn("text-xs py-0", roleColor)}>
                {roleLabel}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(createdAt, { addSuffix: true, locale: fr })}
            </span>
            {comment.edited_at && (
              <span className="text-xs text-muted-foreground italic">(modifié)</span>
            )}
          </div>

          {/* Content */}
          <div className={cn(
            "rounded-lg px-3 py-2",
            isOwn 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted"
          )}>
            <p className="text-sm whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          </div>

          {/* Actions */}
          {isEditable && (
            <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" className="h-6 text-xs">
                <Edit2 className="h-3 w-3 mr-1" />
                Modifier
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2 mt-2">
          {comment.replies.map((reply) => (
            <CommentThread key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  );
}
