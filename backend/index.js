import express from 'express';
import cors from 'cors';
import ollama from 'ollama';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  // Ahora recibimos el mensaje del usuario y el systemPrompt
  const { message, systemPrompt } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const messages = [
      { role: 'user', content: message }
    ];

    // Si hay un systemPrompt, lo añadimos al principio
    if (systemPrompt) {
      messages.unshift({ role: 'system', content: systemPrompt });
    }

    const response = await ollama.chat({
      model: 'llama2',
      messages: messages,
      stream: true,
    });

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    for await (const part of response) {
      res.write(part.message.content);
    }
    res.end();
  } catch (error) {
    console.error('Error communicating with Ollama:', error);
    if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to communicate with Ollama' });
    } else {
        res.end();
    }
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});