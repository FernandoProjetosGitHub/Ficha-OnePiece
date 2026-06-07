export type Id = string;

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: Id;
  conversationId: Id;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: Id;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryItem {
  id: Id;
  category: 'preference' | 'project' | 'goal' | 'setting';
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: Id;
  name: string;
  description: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: Id;
  projectId?: Id;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
