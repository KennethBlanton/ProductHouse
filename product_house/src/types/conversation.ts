export type MessageSender = 'user' | 'assistant';

export interface Message {
  id?: string;
  conversationId?: string;
  content: string;
  sender: MessageSender;
  timestamp: string;
  userId?: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  messages: Message[];
}