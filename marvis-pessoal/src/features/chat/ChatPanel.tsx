import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useState } from 'react';
import type { FormEvent } from 'react';
import type { ChatMessage } from '../../types/domain';
import { sendMessage } from './chatService';

export function ChatPanel() {
  const [conversationId, setConversationId] = useState<string>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!content.trim()) {
      return;
    }

    setIsSending(true);

    try {
      const response = await sendMessage({ conversationId, content });
      setConversationId(response.conversationId);
      setMessages(response.messages);
      setContent('');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Paper component={motion.section} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h2">Chat</Typography>
          <Typography color="text.secondary">Converse com o Blue e mantenha o historico salvo.</Typography>
        </Box>

        <Stack spacing={1} sx={{ minHeight: 280 }}>
          {messages.length === 0 ? (
            <Typography color="text.secondary">Envie a primeira mensagem para iniciar uma conversa.</Typography>
          ) : (
            messages.map((message) => (
              <Paper key={message.id} variant="outlined" sx={{ p: 1.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {message.role}
                </Typography>
                <Typography>{message.content}</Typography>
              </Paper>
            ))
          )}
        </Stack>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <TextField
              fullWidth
              label="Mensagem"
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
            <Button type="submit" endIcon={<SendIcon />} disabled={isSending}>
              Enviar
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}
