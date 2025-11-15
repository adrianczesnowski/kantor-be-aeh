import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { exchangeCurrency } from '../controllers/exchange.controller';

const router = Router();

router.use(authMiddleware);

router.post('/', exchangeCurrency);

export default router;
