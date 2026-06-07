import { randomUUID } from 'node:crypto';
import type { ChatMessage } from '../../../src/types/domain';
import type { AppDatabase } from '../../database/connection';

type MessageRow = {
  id: string;
  conversation_id: string;
  role: ChatMessage['role'];
  content: string;
  created_at: string;
};

function mapMessage(row: MessageRow): ChatMessage {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    role: row.role,
    content: row.content,
    createdAt: row.created_at
  };
}

export async function createConversation(database: AppDatabase, firstMessage: string) {
  const now = new Date().toISOString();
  const id = randomUUID();
  const title = firstMessage.slice(0, 60) || 'Nova conversa';

  await database.run(
    'INSERT INTO conversations (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)',
    id,
    title,
    now,
    now
  );

  return id;
}

export async function addMessage(
  database: AppDatabase,
  input: Pick<ChatMessage, 'conversationId' | 'role' | 'content'>
) {
  const message: ChatMessage = {
    id: randomUUID(),
    conversationId: input.conversationId,
    role: input.role,
    content: input.content,
    createdAt: new Date().toISOString()
  };

  await database.run(
    'INSERT INTO chat_messages (id, conversation_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)',
    message.id,
    message.conversationId,
    message.role,
    message.content,
    message.createdAt
  );

  await database.run('UPDATE conversations SET updated_at = ? WHERE id = ?', message.createdAt, message.conversationId);

  return message;
}

export async function listMessages(database: AppDatabase, conversationId: string) {
  const rows = await database.all<MessageRow[]>(
    'SELECT id, conversation_id, role, content, created_at FROM chat_messages WHERE conversation_id = ? ORDER BY created_at ASC',
    conversationId
  );

  return rows.map(mapMessage);
}
