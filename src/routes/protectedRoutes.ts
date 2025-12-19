import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

router.get('/profile', authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({ message: `Welcome user ${req.user?.id}` });
});

export default router;
