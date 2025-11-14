import { Response } from 'express';
import * as WalletService from '../services/wallet.service';
import { IAuthRequest } from '../middleware/auth.middleware';

/**
 * @desc Pobieranie listy portfeli użytkownika
 * @route GET /api/wallets
 * @access Private
 */
export const getWallets = async (req: IAuthRequest, res: Response) => {
    const userId = req.userId!;
    try {
        const wallets = await WalletService.getUserWallets(userId);
        res.status(200).json(wallets);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

/**
 * @desc Zasilenie konta
 * @route POST /api/wallets/topup
 * @access Private
 */
export const topUp = async (req: IAuthRequest, res: Response) => {
    const { currency, amount } = req.body;
    const userId = req.userId!;

    if (!currency || typeof currency !== 'string' || !amount || typeof amount !== 'number') {
        return res.status(400).json({ message: 'Proszę podać prawidłową walutę i kwotę.' });
    }

    try {
        await WalletService.topUpWallet(userId, currency, amount);

        res.status(200).json({
            message: 'Konto zostało pomyślnie zasilone.',
            amount: amount,
            currency: currency.toUpperCase()
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc Wypłata środków z konta
 * @route POST /api/wallets/withdraw
 * @access Private
 */
export const withdraw = async (req: IAuthRequest, res: Response) => {
    const { currency, amount } = req.body;
    const userId = req.userId!;

    if (!currency || typeof currency !== 'string' || !amount || typeof amount !== 'number') {
        return res.status(400).json({ message: 'Proszę podać prawidłową walutę i kwotę.' });
    }

    try {
        await WalletService.withdrawFromWallet(userId, currency, amount);

        res.status(200).json({
            message: 'Środki zostały pomyślnie wypłacone.',
            amount: amount,
            currency: currency.toUpperCase()
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};