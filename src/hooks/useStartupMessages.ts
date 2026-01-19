import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface Message {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  is_internal: boolean | null;
  parent_id: string | null;
  edited_at: string | null;
  author?: {
    full_name: string | null;
    avatar_url: string | null;
    role?: string;
  };
}

interface UseStartupMessagesResult {
  messages: Message[];
  loading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<boolean>;
  institutionOnline: boolean;
  typingUsers: string[];
  setTyping: (isTyping: boolean) => void;
  unreadCount: number;
  markAsRead: () => Promise<void>;
  applicationId: string | null;
}

export function useStartupMessages(): UseStartupMessagesResult {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [institutionOnline, setInstitutionOnline] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch application ID and messages
  const fetchMessages = useCallback(async () => {
    if (!user || !supabase) return;

    try {
      setLoading(true);
      setError(null);

      // Get user's startup and application
      const { data: startup, error: startupError } = await supabase
        .from("startups")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (startupError || !startup) {
        setLoading(false);
        return;
      }

      const { data: application, error: appError } = await supabase
        .from("applications")
        .select("id")
        .eq("startup_id", startup.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (appError || !application) {
        setLoading(false);
        return;
      }

      setApplicationId(application.id);

      // Fetch messages (non-internal only)
      const { data: comments, error: commentsError } = await supabase
        .from("application_comments")
        .select("*")
        .eq("application_id", application.id)
        .or("is_internal.eq.false,is_internal.is.null")
        .order("created_at", { ascending: true });

      if (commentsError) throw commentsError;

      // Fetch author profiles
      if (comments && comments.length > 0) {
        const userIds = [...new Set(comments.map((c) => c.user_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name, avatar_url")
          .in("user_id", userIds);

        const { data: roles } = await supabase
          .from("user_roles")
          .select("user_id, role")
          .in("user_id", userIds);

        const profileMap = new Map(
          profiles?.map((p) => [p.user_id, p]) || []
        );
        const roleMap = new Map(roles?.map((r) => [r.user_id, r.role]) || []);

        const enrichedMessages: Message[] = comments.map((comment) => ({
          ...comment,
          author: {
            full_name: profileMap.get(comment.user_id)?.full_name || null,
            avatar_url: profileMap.get(comment.user_id)?.avatar_url || null,
            role: roleMap.get(comment.user_id) || undefined,
          },
        }));

        setMessages(enrichedMessages);
      } else {
        setMessages([]);
      }
    } catch (err) {
      setError("Erreur lors du chargement des messages");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Setup realtime subscription
  useEffect(() => {
    if (!applicationId || !user || !supabase) return;

    const channelName = `messages:${applicationId}`;
    
    channelRef.current = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "application_comments",
          filter: `application_id=eq.${applicationId}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const newComment = payload.new as any;
            
            // Only add non-internal messages
            if (newComment.is_internal !== true) {
              // Fetch author info
              const { data: profile } = await supabase
                .from("profiles")
                .select("full_name, avatar_url")
                .eq("user_id", newComment.user_id)
                .single();

              const { data: role } = await supabase
                .from("user_roles")
                .select("role")
                .eq("user_id", newComment.user_id)
                .single();

              const enrichedMessage: Message = {
                ...newComment,
                author: {
                  full_name: profile?.full_name || null,
                  avatar_url: profile?.avatar_url || null,
                  role: role?.role || undefined,
                },
              };

              setMessages((prev) => [...prev, enrichedMessage]);

              // If message is from institution, increment unread count
              if (newComment.user_id !== user.id) {
                setUnreadCount((prev) => prev + 1);
              }
            }
          } else if (payload.eventType === "UPDATE") {
            const updatedComment = payload.new as any;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === updatedComment.id ? { ...m, ...updatedComment } : m
              )
            );
          } else if (payload.eventType === "DELETE") {
            const deletedComment = payload.old as any;
            setMessages((prev) => prev.filter((m) => m.id !== deletedComment.id));
          }
        }
      )
      .on("presence", { event: "sync" }, () => {
        const state = channelRef.current?.presenceState();
        if (state) {
          // Check if any admin or evaluator is online
          const onlineUsers = Object.values(state).flat() as any[];
          const institutionPresent = onlineUsers.some(
            (u) => u.role === "admin" || u.role === "evaluator"
          );
          setInstitutionOnline(institutionPresent);
        }
      })
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        if (payload.user_id !== user.id && payload.is_typing) {
          setTypingUsers((prev) => {
            if (!prev.includes(payload.user_name)) {
              return [...prev, payload.user_name];
            }
            return prev;
          });

          // Remove from typing after 3 seconds
          setTimeout(() => {
            setTypingUsers((prev) =>
              prev.filter((name) => name !== payload.user_name)
            );
          }, 3000);
        } else if (!payload.is_typing) {
          setTypingUsers((prev) =>
            prev.filter((name) => name !== payload.user_name)
          );
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          // Track presence
          await channelRef.current?.track({
            user_id: user.id,
            role: "startup",
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [applicationId, user]);

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Send message
  const sendMessage = useCallback(
    async (content: string): Promise<boolean> => {
      if (!user || !applicationId || !supabase || !content.trim()) {
        return false;
      }

      try {
        const { error: insertError } = await supabase
          .from("application_comments")
          .insert({
            application_id: applicationId,
            user_id: user.id,
            content: content.trim(),
            is_internal: false,
          });

        if (insertError) throw insertError;
        return true;
      } catch (err) {
        console.error("Error sending message:", err);
        return false;
      }
    },
    [user, applicationId]
  );

  // Set typing indicator
  const setTyping = useCallback(
    (isTyping: boolean) => {
      if (!channelRef.current || !user) return;

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      channelRef.current.send({
        type: "broadcast",
        event: "typing",
        payload: {
          user_id: user.id,
          user_name: "Startup",
          is_typing: isTyping,
        },
      });

      // Auto-clear typing after 3 seconds
      if (isTyping) {
        typingTimeoutRef.current = setTimeout(() => {
          channelRef.current?.send({
            type: "broadcast",
            event: "typing",
            payload: {
              user_id: user.id,
              user_name: "Startup",
              is_typing: false,
            },
          });
        }, 3000);
      }
    },
    [user]
  );

  // Mark messages as read
  const markAsRead = useCallback(async () => {
    setUnreadCount(0);
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    institutionOnline,
    typingUsers,
    setTyping,
    unreadCount,
    markAsRead,
    applicationId,
  };
}
