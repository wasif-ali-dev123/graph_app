import { Router } from 'express';
import { getAllSkills, getSkillById } from '../queries/index.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    res.json(await getAllSkills());
  } catch (err) {
    res.status(503).json({ error: 'Database unavailable', detail: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const skill = await getSkillById(req.params.id);
    if (!skill) return res.status(404).json({ error: 'Skill not found' });
    res.json(skill);
  } catch (err) {
    res.status(503).json({ error: 'Database unavailable', detail: err.message });
  }
});

export default router;
