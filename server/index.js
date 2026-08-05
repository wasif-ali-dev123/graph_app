import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { verifyConnectivity, closeDriver } from './db.js';
import engineersRouter from './routes/engineers.js';
import skillsRouter from './routes/skills.js';
import companiesRouter from './routes/companies.js';
import exploreRouter from './routes/explore.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/engineers', engineersRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/companies', companiesRouter);
app.use('/api/explore', exploreRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  const { default: path } = await import('path');
  const { fileURLToPath } = await import('url');
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const clientDist = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

async function start() {
  try {
    await verifyConnectivity();
    console.log('Connected to Neo4j');
  } catch (err) {
    console.warn('Neo4j not reachable on startup — will retry per request:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();

process.on('SIGTERM', async () => {
  await closeDriver();
  process.exit(0);
});
