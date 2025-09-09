import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../../middleware/auth';
import { Activity } from '../../models/Activity';

const router = Router();

router.get('/', auth, async (req, res) => {
  // @ts-expect-error injected by auth middleware
  const userId: string = req.userId;
  const list = await Activity.find({ user: userId }).sort({ createdAt: -1 });
  res.json(list);
});

router.post(
  '/',
  auth,
  body('type').isString(),
  body('data').isObject(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    // @ts-expect-error injected by auth middleware
    const userId: string = req.userId;
    const { type, data } = req.body;
    const activity = await Activity.create({ user: userId, type, data });
    res.status(201).json(activity);
  }
);

export default router;

