import { Request, Response } from 'express';

/**
 * @desc Sprawdza stan serwera
 * @route GET /api/health
 * @access Public
 */
export const checkHealth = (req: Request, res: Response) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString()
    });
};