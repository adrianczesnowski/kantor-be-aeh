import { Router } from 'express';
import { changeLanguage, changePassword } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.put('/language', changeLanguage);
router.put('/password', changePassword);

export default router;
