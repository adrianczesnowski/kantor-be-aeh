import { Request, Response } from 'express';
import * as RateService from '../services/rate.service';

export const getLatestRates = async (req: Request, res: Response) => {
    try {
        const [ratesA, ratesB] = await Promise.all([
            RateService.getRatesTable('a'),
            RateService.getRatesTable('b')
        ]);

        const allRates = [...ratesA, ...ratesB];

        res.status(200).json(allRates);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getCurrencyHistory = async (req: Request, res: Response) => {
    try {
        const { currencyCode } = req.params;
        const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;

        if (!currencyCode) {
            return res.status(400).json({ message: 'Proszę podać kod waluty.' });
        }
        if (isNaN(days) || days <= 0) {
            return res.status(400).json({ message: 'Liczba dni musi być wartością dodatnią.' });
        }

        const history = await RateService.getHistoricalRates(currencyCode, days);
        res.status(200).json(history);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};