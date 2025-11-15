import { Response } from 'express';
import * as TransactionService from '../services/transaction.service';
import { IAuthRequest } from '../middleware/auth.middleware';

/**
 * @desc Pobieranie historii transakcji użytkownika
 * @route GET /api/transactions
 * @access Private
 */
export const getTransactionHistory = async (req: IAuthRequest, res: Response) => {
    const userId = req.userId!;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = parseInt(req.query.skip as string) || 0;

    try {
        const transactions = await TransactionService.getTransactionsByUserId(userId, limit, skip);
        res.status(200).json(transactions);
    } catch (error: any) {
        res.status(500).json({ message: 'Błąd serwera podczas pobierania historii transakcji.' });
    }
};

/**
 * @desc Pobieranie szczegółów konkretnej transakcji
 * @route GET /api/transactions/:id
 * @access Private
 */
export const getTransactionDetails = async (req: IAuthRequest, res: Response) => {
    const userId = req.userId!;
    const { id: transactionId } = req.params;

    try {
        const transaction = await TransactionService.getTransactionById(transactionId, userId);

        if (!transaction) {
            return res.status(404).json({ message: 'Transakcja nie została znaleziona lub nie masz do niej dostępu.' });
        }

        res.status(200).json(transaction);
    } catch (error: any) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Nieprawidłowy format ID transakcji.' });
        }
        res.status(500).json({ message: 'Błąd serwera podczas pobierania szczegółów transakcji.' });
    }
};
