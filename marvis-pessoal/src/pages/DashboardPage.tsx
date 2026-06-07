import FolderIcon from '@mui/icons-material/Folder';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import MemoryIcon from '@mui/icons-material/Memory';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ChatPanel } from '../features/chat/ChatPanel';

const modules = [
  {
    title: 'Projetos',
    description: 'Organizar RPG Westeros, Controle de Emprestimos, Estudos React e outros contextos.',
    icon: <FolderIcon />
  },
  {
    title: 'Tarefas',
    description: 'Criar, editar, concluir e priorizar atividades por projeto.',
    icon: <TaskAltIcon />
  },
  {
    title: 'Memoria',
    description: 'Guardar preferencias, objetivos, projetos e configuracoes importantes.',
    icon: <MemoryIcon />
  },
  {
    title: 'Conhecimento',
    description: 'Preparar ingestao futura de PDFs, Markdown e anotacoes pessoais.',
    icon: <LibraryBooksIcon />
  }
];

export function DashboardPage() {
  return (
    <Stack spacing={3}>
      <ChatPanel />

      <Grid container spacing={2}>
        {modules.map((module) => (
          <Grid key={module.title} size={{ xs: 12, md: 6 }}>
            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                {module.icon}
                <Stack spacing={0.5}>
                  <Typography variant="h2">{module.title}</Typography>
                  <Typography color="text.secondary">{module.description}</Typography>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
