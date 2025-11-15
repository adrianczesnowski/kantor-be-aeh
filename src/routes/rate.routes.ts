import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { getLatestRates, getCurrencyHistory } from '../controllers/rate.controller';

const router = Router();

router.use(authMiddleware);

router.get('/latest', getLatestRates);
router.get('/:currencyCode/history', getCurrencyHistory);

export default router;