import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { getDatabase } from './database/connection';
import { chatRoutes } from './modules/chat/chatRoutes';
import { projectRoutes } from './modules/projects/projectRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', name: 'blue-api' });
});

app.use('/api/chat', chatRoutes);
app.use('/api/projects', projectRoutes);

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error(error);
  response.status(500).json({ message: 'Erro interno do Blue.' });
});

await getDatabase();

app.listen(env.port, () => {
  console.log(`Blue API ouvindo em http://localhost:${env.port}`);
});
