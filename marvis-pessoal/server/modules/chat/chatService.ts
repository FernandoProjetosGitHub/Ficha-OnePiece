import OpenAI from 'openai';
import { env } from '../../config/env';
import type { AppDatabase } from '../../database/connection';
import { addMessage, createConversation, listMessages } from './chatRepository';

const openai = env.openAiApiKey ? new OpenAI({ apiKey: env.openAiApiKey }) : null;

export async function handleUserMessage(database: AppDatabase, content: string, conversationId?: string) {
  const activeConversationId = conversationId ?? (await createConversation(database, content));

  await addMessage(database, {
    conversationId: activeConversationId,
    role: 'user',
    content
  });

  const assistantContent = await createAssistantReply(content);

  await addMessage(database, {
    conversationId: activeConversationId,
    role: 'assistant',
    content: assistantContent
  });

  return {
    conversationId: activeConversationId,
    messages: await listMessages(database, activeConversationId)
  };
}

async function createAssistantReply(content: string) {
  if (!openai) {
    return `Recebi: "${content}". Configure OPENAI_API_KEY no arquivo .env para ativar respostas reais da IA.`;
  }

  const response = await openai.responses.create({
    model: 'gpt-4.1-mini',
    input: [
      {
        role: 'system',
        content:
          'Voce e Blue, um assistente pessoal objetivo, organizado e didatico. Responda em portugues do Brasil.'
      },
      {
        role: 'user',
        content
      }
    ]
  });

  return response.output_text;
}
