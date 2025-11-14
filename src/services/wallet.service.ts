import User from '../models/user.model';
import mongoose from 'mongoose';
import { createTransaction } from './transaction.service';

/**
 * Pobiera wszystkie portfele należące do użytkownika.
 * @param userId - ID użytkownika.
 * @returns Tablica portfeli użytkownika.
 */
export const getUserWallets = async (userId: string) => {
    const user = await User.findById(userId).select('wallets');
    if (!user) {
        throw new Error('Użytkownik nie został znaleziony.');
    }
    return user.wallets;
};

/**
 * Logika zasilenia portfela użytkownika.
 * @param userId - ID użytkownika wykonującego operację
 * @param currency - Waluta do zasilenia (np. "EUR", "USD")
 * @param amount - Kwota zasilenia
 */
export const topUpWallet = async (userId: string, currency: string, amount: number) => {
    if (amount <= 0) {
        throw new Error('Kwota zasilenia musi być dodatnia.');
    }
    const upperCaseCurrency = currency.toUpperCase();

    const user = await User.findById(userId);
    if (!user) {
        throw new Error('Użytkownik nie został znaleziony.');
    }

    const wallet = user.wallets.find(w => w.currency === upperCaseCurrency);

    if (wallet) {
        const currentBalance = parseFloat(wallet.balance);
        wallet.balance = (currentBalance + amount).toFixed(2).toString();
    } else {
        user.wallets.push({ currency: upperCaseCurrency, balance: amount.toFixed(2).toString() });
    }

    await createTransaction({
        userId: user.id,
        type: 'topup',
        toCurrency: upperCaseCurrency,
        toAmount: amount.toFixed(2).toString(),
    });

    await user.save();
    return user.wallets;
};

/**
 * Logika wypłaty środków z portfela.
 * @param userId - ID użytkownika
 * @param currency - Waluta do wypłaty
 * @param amount - Kwota do wypłaty
 */
export const withdrawFromWallet = async (userId: string, currency: string, amount: number) => {
    if (amount <= 0) {
        throw new Error('Kwota wypłaty musi być dodatnia.');
    }
    const upperCaseCurrency = currency.toUpperCase();

    const user = await User.findById(userId);
    if (!user) {
        throw new Error('Użytkownik nie został znaleziony.');
    }

    const wallet = user.wallets.find(w => w.currency === upperCaseCurrency);

    if (!wallet) {
        throw new Error(`Nie posiadasz portfela w walucie ${upperCaseCurrency}.`);
    }

    const currentBalance = parseFloat(wallet.balance);
    if (currentBalance < amount) {
        throw new Error('Niewystarczające środki na koncie.');
    }

    wallet.balance = (currentBalance - amount).toFixed(2).toString();

    await createTransaction({
        userId: user.id,
        type: 'withdraw',
        fromCurrency: upperCaseCurrency,
        fromAmount: amount.toFixed(2).toString(),
    });

    await user.save();
    return user.wallets;
};