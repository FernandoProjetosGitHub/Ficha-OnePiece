import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT ?? 3333),
  databasePath: process.env.DATABASE_PATH ?? './data/blue.sqlite',
  openAiApiKey: process.env.OPENAI_API_KEY
};
