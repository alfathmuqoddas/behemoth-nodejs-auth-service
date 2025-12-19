import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = Router();

router.get('/profile', authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({ message: `Welcome user ${req.user?.id}` });
});

router.get('/admin', authMiddleware, adminMiddleware, (req: AuthRequest, res: Response) => {
  res.json({ message: 'Welcome to the admin area!' });
});

export default router;
