import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FolderIcon from '@mui/icons-material/Folder';
import MemoryIcon from '@mui/icons-material/Memory';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

type AppShellProps = {
  children: ReactNode;
};

const sections = [
  { label: 'Chat', icon: <AutoAwesomeIcon fontSize="small" /> },
  { label: 'Projetos', icon: <FolderIcon fontSize="small" /> },
  { label: 'Tarefas', icon: <TaskAltIcon fontSize="small" /> },
  { label: 'Memoria', icon: <MemoryIcon fontSize="small" /> }
];

export function AppShell({ children }: AppShellProps) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '260px 1fr' },
          minHeight: '100vh'
        }}
      >
        <Box component="aside" sx={{ borderRight: { md: 1 }, borderColor: 'divider', p: 2 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h1">Marvis</Typography>
              <Typography color="text.secondary">Assistente pessoal modular</Typography>
            </Box>

            <Divider />

            <Stack spacing={1}>
              {sections.map((section) => (
                <Chip
                  key={section.label}
                  icon={section.icon}
                  label={section.label}
                  variant="outlined"
                  sx={{ justifyContent: 'flex-start', px: 1 }}
                />
              ))}
            </Stack>
          </Stack>
        </Box>

        <Box component="main" sx={{ p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
