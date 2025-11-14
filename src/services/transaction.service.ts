import Transaction, { ITransaction, TransactionType } from '../models/transaction.model';
import { Types } from 'mongoose';

interface TransactionData {
    userId: string | Types.ObjectId;
    type: TransactionType;
    fromCurrency?: string;
    toCurrency?: string;
    fromAmount?: string;
    toAmount?: string;
    rateUsed?: string;
}

/**
 * Tworzy i zapisuje nową transakcję w bazie danych.
 * @param data - Obiekt z danymi transakcji.
 * @returns Zapisany dokument transakcji.
 */
export const createTransaction = async (data: TransactionData): Promise<ITransaction> => {
    const transaction = new Transaction({
        ...data,
        timestamp: new Date(),
    });
    await transaction.save();
    return transaction;
};

/**
 * Pobiera szczegóły pojedynczej transakcji.
 * Sprawdza, czy transakcja należy do danego użytkownika.
 * @param transactionId - ID transakcji.
 * @param userId - ID użytkownika, który wysyła żądanie.
 * @returns Dokument transakcji lub null, jeśli nie znaleziono lub brak dostępu.
 */
export const getTransactionById = async (transactionId: string, userId: string): Promise<ITransaction | null> => {
    const transaction = await Transaction.findById(transactionId);

    if (!transaction || transaction.userId.toString() !== userId) {
        return null;
    }

    return transaction;
};

/**
 * Pobiera historię transakcji dla danego użytkownika z paginacją, posortowaną od najnowszej.
 * Rozwiązuje błąd typowania Mongoose/TS poprzez użycie .lean() i jawne rzutowanie typu.
 * * @param userId - ID użytkownika, którego transakcje mają zostać pobrane.
 * @param limit - Maksymalna liczba transakcji do pobrania.
 * @param skip - Liczba transakcji do pominięcia (offset).
 * @returns Lista transakcji.
 */
export const getTransactionsByUserId = async (userId: string, limit: number, skip: number): Promise<ITransaction[]> => {

    const transactions = await Transaction.find({ userId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .skip(skip)
        .lean();

    return transactions as unknown as ITransaction[];
};