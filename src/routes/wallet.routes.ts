import { Router } from 'express';
import { topUp, withdraw, getWallets } from '../controllers/wallet.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getWallets);
router.post('/topup', topUp);
router.post('/withdraw', withdraw);

export default router;