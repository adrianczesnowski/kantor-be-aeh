import { Router } from 'express';
import { checkHealth } from '../controllers/health.controller.ts';

const router = Router();

router.get('/', checkHealth);

export default router;