import { Router } from 'express';
import { getDatabase } from '../../database/connection';
import { handleUserMessage } from './chatService';

export const chatRoutes = Router();

chatRoutes.post('/messages', async (request, response, next) => {
  try {
    const { content, conversationId } = request.body as {
      content?: string;
      conversationId?: string;
    };

    if (!content?.trim()) {
      response.status(400).json({ message: 'O campo content e obrigatorio.' });
      return;
    }

    const database = await getDatabase();
    const result = await handleUserMessage(database, content.trim(), conversationId);

    response.json(result);
  } catch (error) {
    next(error);
  }
});
