import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface CommentAuthor {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  role?: string;
}

export interface Comment {
  id: string;
  application_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  is_internal: boolean;
  mentions: string[];
  created_at: string;
  edited_at: string | null;
  attachments: Record<string, unknown>[];
  author?: CommentAuthor;
  replies?: Comment[];
}

export interface OnlineUser {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
  online_at: string;
}

interface UseEvaluationCommentsResult {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  sendComment: (content: string, parentId?: string | null, mentions?: string[]) => Promise<boolean>;
  editComment: (commentId: string, newContent: string) => Promise<boolean>;
  onlineUsers: OnlineUser[];
  typingUsers: string[];
  setTyping: (isTyping: boolean) => void;
  participants: CommentAuthor[];
}

export function useEvaluationComments(applicationId: string): UseEvaluationCommentsResult {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [participants, setParticipants] = useState<CommentAuthor[]>([]);
  
  const channelRef = useRef<RealtimeChannel | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch comments with authors
  const fetchComments = useCallback(async () => {
    if (!applicationId || !supabase) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from("application_comments")
        .select("*")
        .eq("application_id", applicationId)
        .order("created_at", { ascending: true });

      if (commentsError) throw commentsError;

      // Get unique user IDs
      const userIds = [...new Set((commentsData || []).map(c => c.user_id))];
      
      // Fetch profiles for these users
      let profilesMap: Record<string, CommentAuthor> = {};
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("user_id, full_name, avatar_url")
          .in("user_id", userIds);

        if (profilesData) {
          profilesMap = profilesData.reduce((acc, p) => {
            acc[p.user_id] = p;
            return acc;
          }, {} as Record<string, CommentAuthor>);
        }

        // Fetch roles for these users
        const { data: rolesData } = await supabase
          .from("user_roles")
          .select("user_id, role")
          .in("user_id", userIds);

        if (rolesData) {
          rolesData.forEach(r => {
            if (profilesMap[r.user_id]) {
              profilesMap[r.user_id].role = r.role;
            }
          });
        }
      }

      // Map comments with authors
      const commentsWithAuthors: Comment[] = (commentsData || []).map(c => ({
        ...c,
        mentions: c.mentions || [],
        attachments: c.attachments || [],
        author: profilesMap[c.user_id] || { user_id: c.user_id, full_name: null, avatar_url: null }
      }));

      // Organize into threads
      const rootComments = commentsWithAuthors.filter(c => !c.parent_id);
      const childComments = commentsWithAuthors.filter(c => c.parent_id);

      rootComments.forEach(root => {
        root.replies = childComments.filter(child => child.parent_id === root.id);
      });

      setComments(rootComments);
      setParticipants(Object.values(profilesMap));
    } catch (err: unknown) {
      console.error("Error fetching comments:", err);
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des commentaires");
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  // Setup realtime subscription
  useEffect(() => {
    if (!applicationId || !supabase || !user) return;

    fetchComments();

    // Create channel for this application
    const channel = supabase.channel(`evaluation:${applicationId}`, {
      config: {
        presence: { key: user.id },
      },
    });

    // Listen for new comments
    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "application_comments",
        filter: `application_id=eq.${applicationId}`,
      },
      (payload) => {
        
        // Refetch to get proper author info
        fetchComments();
      }
    );

    // Presence tracking
    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const users: OnlineUser[] = [];
      Object.values(state).forEach((presenceList) => {
        presenceList.forEach((presence: Record<string, unknown>) => {
          if (presence.user_id) {
            users.push({
              user_id: String(presence.user_id),
              full_name: String(presence.full_name || "Anonyme"),
              avatar_url: presence.avatar_url ? String(presence.avatar_url) : null,
              role: String(presence.role || "evaluator"),
              online_at: String(presence.online_at || new Date().toISOString()),
            });
          }
        });
      });
      setOnlineUsers(users);
    });

    // Typing indicator
    channel.on("broadcast", { event: "typing" }, ({ payload }) => {
      if (payload.user_id !== user.id) {
        setTypingUsers(prev => {
          if (!prev.includes(payload.full_name)) {
            return [...prev, payload.full_name];
          }
          return prev;
        });

        // Auto-remove after 3 seconds
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(u => u !== payload.full_name));
        }, 3000);
      }
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({
          user_id: user.id,
          full_name: profile?.full_name || "Anonyme",
          avatar_url: profile?.avatar_url || null,
          role: "evaluator",
          online_at: new Date().toISOString(),
        });
      }
    });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
    };
  }, [applicationId, user, profile, fetchComments]);

  // Send typing indicator
  const setTyping = useCallback((isTyping: boolean) => {
    if (!channelRef.current || !user || !profile) return;

    if (isTyping) {
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      channelRef.current.send({
        type: "broadcast",
        event: "typing",
        payload: {
          user_id: user.id,
          full_name: profile.full_name || "Anonyme",
        },
      });

      // Set timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        // Could send a "stopped typing" event if needed
      }, 3000);
    }
  }, [user, profile]);

  // Send a new comment
  const sendComment = useCallback(async (
    content: string,
    parentId: string | null = null,
    mentions: string[] = []
  ): Promise<boolean> => {
    if (!supabase || !user) return false;

    try {
      const { error: insertError } = await supabase
        .from("application_comments")
        .insert({
          application_id: applicationId,
          user_id: user.id,
          content,
          parent_id: parentId,
          mentions,
          is_internal: true,
        });

      if (insertError) throw insertError;
      return true;
    } catch (err: unknown) {
      console.error("Error sending comment:", err);
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi du commentaire");
      return false;
    }
  }, [applicationId, user]);

  // Edit an existing comment
  const editComment = useCallback(async (
    commentId: string,
    newContent: string
  ): Promise<boolean> => {
    if (!supabase) return false;

    try {
      const { error: updateError } = await supabase
        .from("application_comments")
        .update({
          content: newContent,
          edited_at: new Date().toISOString(),
        })
        .eq("id", commentId);

      if (updateError) throw updateError;
      return true;
    } catch (err: unknown) {
      console.error("Error editing comment:", err);
      setError(err instanceof Error ? err.message : "Erreur lors de la modification du commentaire");
      return false;
    }
  }, []);

  return {
    comments,
    loading,
    error,
    sendComment,
    editComment,
    onlineUsers,
    typingUsers,
    setTyping,
    participants,
  };
}
