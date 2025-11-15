import { Response } from 'express';
import { IAuthRequest } from '../middleware/auth.middleware';
import * as ExchangeService from '../services/exchange.service';

/**
 * @desc Wymiana waluty pomiędzy kontami użytkownika
 * @route POST /api/exchange
 * @access Private
 */
export const exchangeCurrency = async (req: IAuthRequest, res: Response) => {
    const userId = req.userId!;
    const { fromCurrency, toCurrency, amount } = req.body;

    if (!fromCurrency || !toCurrency || !amount || typeof amount !== 'number') {
        return res.status(400).json({ message: 'Proszę podać walutę źródłową, docelową oraz kwotę.' });
    }

    try {
        const result = await ExchangeService.performExchange(userId, fromCurrency, toCurrency, amount);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};