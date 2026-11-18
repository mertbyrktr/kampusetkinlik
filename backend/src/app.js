import express from 'express';
import cors from 'cors';
import eventRoutes from './routes/event-routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), student: '2321032070' });
});

app.use('/events', eventRoutes);

app.use((req, res) => {
  res.status(404).json({ error: { message: 'Route not found' } });
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { message: 'Invalid JSON body' } });
  }
  if (error.status === 413) {
    return res.status(413).json({ error: { message: 'Request body too large' } });
  }
  if (error.status >= 400 && error.status < 500) {
    return res.status(error.status).json({ error: { message: 'Invalid request' } });
  }
  console.error(error.name);
  res.status(500).json({ error: { message: 'Server error' } });
});

export default app;
