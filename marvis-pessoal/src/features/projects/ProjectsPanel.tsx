import FolderIcon from '@mui/icons-material/Folder';
import HistoryIcon from '@mui/icons-material/History';
import NotesIcon from '@mui/icons-material/Notes';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import type { Project } from '../../types/domain';
import { listProjects } from './projectService';

export function ProjectsPanel() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    listProjects().then((response) => setProjects(response.projects));
  }, []);

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h2">Projetos</Typography>
          <Typography color="text.secondary">Contextos que o Blue usa para organizar conversas e tarefas.</Typography>
        </Box>

        <Stack spacing={1.5}>
          {projects.map((project) => (
            <Paper key={project.id} sx={{ p: 2 }}>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <FolderIcon color="primary" />
                  <Typography variant="h2">{project.name}</Typography>
                  <Chip label="Game of Thrones" size="small" color="secondary" />
                </Stack>

                <Typography color="text.secondary">{project.description}</Typography>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ flex: 1 }}>
                    <NotesIcon fontSize="small" />
                    <Typography>{project.notes}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ flex: 1 }}>
                    <HistoryIcon fontSize="small" />
                    <Typography>{project.history}</Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
