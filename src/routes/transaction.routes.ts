import { Router } from 'express';
import { getTransactionHistory, getTransactionDetails } from '../controllers/transaction.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getTransactionHistory);
router.get('/:id', getTransactionDetails);

export default router;
