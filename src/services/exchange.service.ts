import User from '../models/user.model';
import * as NbpService from './nbp.service';
import { createTransaction } from './transaction.service';

export const performExchange = async (
    userId: string,
    fromCurrency: string,
    toCurrency: string,
    fromAmount: number
) => {
    if (fromAmount <= 0) {
        throw new Error('Kwota wymiany musi być dodatnia.');
    }
    if (fromCurrency === toCurrency) {
        throw new Error('Waluta źródłowa i docelowa nie mogą być takie same.');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new Error('Użytkownik nie został znaleziony.');
    }

    const fromWallet = user.wallets.find(w => w.currency === fromCurrency);
    if (!fromWallet || parseFloat(fromWallet.balance) < fromAmount) {
        throw new Error(`Niewystarczające środki w portfelu ${fromCurrency}.`);
    }

    let toAmount: number;
    let rateUsed: number;

    if (fromCurrency === 'PLN') {
        const rates = await NbpService.getCurrencyRates(toCurrency);
        rateUsed = rates.ask;
        toAmount = fromAmount / rateUsed;

    } else if (toCurrency === 'PLN') {
        const rates = await NbpService.getCurrencyRates(fromCurrency);
        rateUsed = rates.bid;
        toAmount = fromAmount * rateUsed;

    } else {
        const [ratesFrom, ratesTo] = await Promise.all([
            NbpService.getCurrencyRates(fromCurrency),
            NbpService.getCurrencyRates(toCurrency)
        ]);

        const intermediatePlnAmount = fromAmount * ratesFrom.bid;

        toAmount = intermediatePlnAmount / ratesTo.ask;

        rateUsed = ratesFrom.bid / ratesTo.ask;
    }

    fromWallet.balance = (parseFloat(fromWallet.balance) - fromAmount).toFixed(2);

    let toWallet = user.wallets.find(w => w.currency === toCurrency);
    if (toWallet) {
        toWallet.balance = (parseFloat(toWallet.balance) + toAmount).toFixed(2);
    } else {
        user.wallets.push({ currency: toCurrency, balance: toAmount.toFixed(2) });
    }

    await createTransaction({
        userId: user.id,
        type: 'exchange',
        fromCurrency,
        toCurrency,
        fromAmount: fromAmount.toFixed(2),
        toAmount: toAmount.toFixed(2),
        rateUsed: rateUsed.toString(),
    });

    await user.save();

    return {
        message: 'Wymiana zakończona pomyślnie.',
        fromAmount: fromAmount.toFixed(2),
        fromCurrency,
        toAmount: toAmount.toFixed(2),
        toCurrency,
        rateUsed: rateUsed.toString(),
    };
};