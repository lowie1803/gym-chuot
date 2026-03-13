import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export function useConversationPreviews(conversationIds, activeConversationId) {
  const { user } = useAuth();
  const [previews, setPreviews] = useState({});
  const activeConvRef = useRef(activeConversationId);
  activeConvRef.current = activeConversationId;

  // Initial fetch
  useEffect(() => {
    if (!conversationIds.length || !user) return;

    async function fetch() {
      const [lastMsgs, unreadCounts] = await Promise.all([
        supabase.rpc("get_last_messages", { p_conversation_ids: conversationIds }),
        supabase.rpc("get_unread_counts", { p_user_id: user.id, p_conversation_ids: conversationIds }),
      ]);

      const initial = {};
      for (const convId of conversationIds) {
        initial[convId] = { lastMessage: null, unreadCount: 0 };
      }

      if (lastMsgs.data) {
        for (const msg of lastMsgs.data) {
          initial[msg.conversation_id] = {
            ...initial[msg.conversation_id],
            lastMessage: { type: msg.type, text: msg.text, sender_id: msg.sender_id, created_at: msg.created_at },
          };
        }
      }

      if (unreadCounts.data) {
        for (const row of unreadCounts.data) {
          if (initial[row.conversation_id]) {
            initial[row.conversation_id].unreadCount = row.unread_count;
          }
        }
      }

      setPreviews(initial);
    }

    fetch();
  }, [conversationIds.join(","), user?.id]);

  // Realtime: listen for new messages involving this user
  useEffect(() => {
    if (!user || !conversationIds.length) return;

    const channel = supabase
      .channel("conversation-previews")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${user.id}`,
        },
        (payload) => {
          const msg = payload.new;
          setPreviews((prev) => {
            const existing = prev[msg.conversation_id];
            if (!existing) return prev;
            const isActive = msg.conversation_id === activeConvRef.current;
            return {
              ...prev,
              [msg.conversation_id]: {
                lastMessage: { type: msg.type, text: msg.text, sender_id: msg.sender_id, created_at: msg.created_at },
                unreadCount: isActive ? existing.unreadCount : existing.unreadCount + 1,
              },
            };
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `sender_id=eq.${user.id}`,
        },
        (payload) => {
          const msg = payload.new;
          setPreviews((prev) => {
            const existing = prev[msg.conversation_id];
            if (!existing) return prev;
            return {
              ...prev,
              [msg.conversation_id]: {
                ...existing,
                lastMessage: { type: msg.type, text: msg.text, sender_id: msg.sender_id, created_at: msg.created_at },
              },
            };
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationIds.join(","), user?.id]);

  const markAsRead = useCallback(
    async (convId) => {
      if (!user || !convId) return;

      // Optimistic: clear unread count locally
      setPreviews((prev) => {
        const existing = prev[convId];
        if (!existing || existing.unreadCount === 0) return prev;
        return { ...prev, [convId]: { ...existing, unreadCount: 0 } };
      });

      await supabase.from("conversation_reads").upsert(
        { user_id: user.id, conversation_id: convId, last_read_at: new Date().toISOString() },
        { onConflict: "user_id,conversation_id" }
      );
    },
    [user?.id]
  );

  return { previews, markAsRead };
}
