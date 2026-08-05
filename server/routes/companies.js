import { Router } from 'express';
import { getAllCompanies } from '../queries/index.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    res.json(await getAllCompanies());
  } catch (err) {
    res.status(503).json({ error: 'Database unavailable', detail: err.message });
  }
});

export default router;
