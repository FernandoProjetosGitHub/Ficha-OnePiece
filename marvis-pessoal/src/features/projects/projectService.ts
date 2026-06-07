import { apiClient } from '../../services/apiClient';
import type { Project } from '../../types/domain';

export const gameOfThronesProjectFallback: Project = {
  id: 'game-of-thrones-local-preview',
  name: 'Game of Thrones',
  description: 'Projeto de teste do Blue usando Game of Thrones como contexto de organizacao.',
  notes: 'Testar memoria, tarefas, notas e conversas relacionadas a casas, personagens e campanhas.',
  history: 'Projeto criado como primeiro contexto real para validar o Blue.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export async function listProjects() {
  try {
    return await apiClient<{ projects: Project[] }>('/projects');
  } catch {
    return { projects: [gameOfThronesProjectFallback] };
  }
}
