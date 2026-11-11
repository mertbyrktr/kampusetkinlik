import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), student: '2321032070' });
});

app.use((req, res) => {
  res.status(404).json({ error: { message: 'Route not found' } });
});

// JSON parser errors must use the same error envelope as controller errors.
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status = error.status >= 400 && error.status < 500 ? error.status : 500;
  res.status(status).json({ error: {
    message: error.type === 'entity.parse.failed' ? 'Invalid JSON body'
      : status === 413 ? 'Request body too large' : 'Internal server error',
  } });
});

export default app;
