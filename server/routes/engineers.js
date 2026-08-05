import { Router } from 'express';
import {
  getAllEngineers,
  getEngineerById,
  searchEngineers,
  getRelatedEngineers,
  getSkillBridge,
} from '../queries/index.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    const data = q ? await searchEngineers(q) : await getAllEngineers();
    res.json(data);
  } catch (err) {
    res.status(503).json({ error: 'Database unavailable', detail: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const engineer = await getEngineerById(req.params.id);
    if (!engineer) return res.status(404).json({ error: 'Engineer not found' });
    res.json(engineer);
  } catch (err) {
    res.status(503).json({ error: 'Database unavailable', detail: err.message });
  }
});

router.get('/:id/related', async (req, res) => {
  try {
    const data = await getRelatedEngineers(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(503).json({ error: 'Database unavailable', detail: err.message });
  }
});

router.get('/:fromId/bridge/:toId', async (req, res) => {
  try {
    const data = await getSkillBridge(req.params.fromId, req.params.toId);
    if (!data) return res.status(404).json({ error: 'No path found' });
    res.json(data);
  } catch (err) {
    res.status(503).json({ error: 'Database unavailable', detail: err.message });
  }
});

export default router;
