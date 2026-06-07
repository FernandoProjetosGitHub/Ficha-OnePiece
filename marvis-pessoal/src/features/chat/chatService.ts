import { apiClient } from '../../services/apiClient';
import type { ChatMessage } from '../../types/domain';

export type SendMessageInput = {
  conversationId?: string;
  content: string;
};

export type SendMessageResponse = {
  conversationId: string;
  messages: ChatMessage[];
};

export function sendMessage(input: SendMessageInput) {
  return apiClient<SendMessageResponse>('/chat/messages', {
    method: 'POST',
    body: input
  });
}
