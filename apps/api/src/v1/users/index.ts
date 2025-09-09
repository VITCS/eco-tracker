import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { User } from '../../models/User';

const router = Router();

router.get('/me', auth, async (req, res) => {
  // @ts-expect-error injected by auth middleware
  const userId: string = req.userId;
  const user = await User.findById(userId).select('-password');
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json(user);
});

export default router;

