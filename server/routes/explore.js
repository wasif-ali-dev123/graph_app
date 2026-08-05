import { Router } from 'express';
import { getMostConnectedSkills, getRoles, matchEngineersForRole } from '../queries/index.js';

const router = Router();

router.get('/skills/connected', async (_req, res) => {
  try {
    res.json(await getMostConnectedSkills());
  } catch (err) {
    res.status(503).json({ error: 'Database unavailable', detail: err.message });
  }
});

router.get('/roles', async (_req, res) => {
  try {
    res.json(await getRoles());
  } catch (err) {
    res.status(503).json({ error: 'Database unavailable', detail: err.message });
  }
});

router.get('/roles/:id/match', async (req, res) => {
  try {
    res.json(await matchEngineersForRole(req.params.id));
  } catch (err) {
    res.status(503).json({ error: 'Database unavailable', detail: err.message });
  }
});

export default router;
