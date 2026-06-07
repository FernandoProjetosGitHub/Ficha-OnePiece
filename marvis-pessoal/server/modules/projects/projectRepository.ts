import { randomUUID } from 'node:crypto';
import type { Project } from '../../../src/types/domain';
import type { AppDatabase } from '../../database/connection';

type ProjectRow = {
  id: string;
  name: string;
  description: string;
  notes: string;
  history: string;
  created_at: string;
  updated_at: string;
};

const gameOfThronesProject = {
  name: 'Game of Thrones',
  description: 'Projeto de teste do Blue usando Game of Thrones como contexto de organizacao.',
  notes:
    'Usar este projeto para testar memoria, tarefas, notas e conversas relacionadas a casas, personagens e campanhas.',
  history: 'Projeto criado como primeiro contexto real para validar o Blue.'
};

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    notes: row.notes,
    history: row.history,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function ensureGameOfThronesProject(database: AppDatabase) {
  const existingProject = await database.get<ProjectRow>(
    'SELECT * FROM projects WHERE name = ?',
    gameOfThronesProject.name
  );

  if (existingProject) {
    return mapProject(existingProject);
  }

  const now = new Date().toISOString();
  const id = randomUUID();

  await database.run(
    `INSERT INTO projects (id, name, description, notes, history, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    id,
    gameOfThronesProject.name,
    gameOfThronesProject.description,
    gameOfThronesProject.notes,
    gameOfThronesProject.history,
    now,
    now
  );

  return {
    id,
    ...gameOfThronesProject,
    createdAt: now,
    updatedAt: now
  };
}

export async function listProjects(database: AppDatabase) {
  await ensureGameOfThronesProject(database);

  const rows = await database.all<ProjectRow[]>('SELECT * FROM projects ORDER BY updated_at DESC');

  return rows.map(mapProject);
}
