import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { getDatabase } from './database/connection';
import { chatRoutes } from './modules/chat/chatRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', name: 'marvis-api' });
});

app.use('/api/chat', chatRoutes);

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error(error);
  response.status(500).json({ message: 'Erro interno do Marvis.' });
});

await getDatabase();

app.listen(env.port, () => {
  console.log(`Marvis API ouvindo em http://localhost:${env.port}`);
});
