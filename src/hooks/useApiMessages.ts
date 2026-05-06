import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export type ApiMessage = {
  id: number;
  sender_id: number;
  receiver_id: number;
  vendor_id?: number;
  body: string;
  is_read: boolean;
  created_at: string;
  sender: { name: string; email: string };
  receiver: { name: string; email: string };
};

export function useApiMessages() {
  const queryClient = useQueryClient();

  // Get all messages/conversations
  const query = useQuery({
    queryKey: ["messages"],
    queryFn: () => api.get<ApiMessage[]>("/messages"),
  });

  // Get conversation with specific user
  const useConversation = (otherUserId: number | string) => useQuery({
    queryKey: ["messages", otherUserId],
    queryFn: () => api.get<ApiMessage[]>(`/messages/${otherUserId}`),
    enabled: !!otherUserId,
  });

  // Send message
  const sendMessage = useMutation({
    mutationFn: (data: { receiver_id: number | string; body: string; vendor_id?: string | number }) => {
      return api.post<ApiMessage>("/messages", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  // Mark as read
  const markAsRead = useMutation({
    mutationFn: (otherUserId: number | string) => {
      return api.patch(`/messages/${otherUserId}/read`, {});
    },
    onSuccess: (_, otherUserId) => {
      queryClient.invalidateQueries({ queryKey: ["messages", otherUserId] });
    },
  });

  return {
    ...query,
    useConversation,
    sendMessage,
    markAsRead,
  };
}
