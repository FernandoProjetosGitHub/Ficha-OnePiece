import { Router } from 'express';
import { getDatabase } from '../../database/connection';
import { listProjects } from './projectRepository';

export const projectRoutes = Router();

projectRoutes.get('/', async (_request, response, next) => {
  try {
    const database = await getDatabase();
    const projects = await listProjects(database);

    response.json({ projects });
  } catch (error) {
    next(error);
  }
});
