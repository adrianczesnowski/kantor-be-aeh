import axios from 'axios';

interface RateData {
    no: string;
    effectiveDate: string;
    mid: number;
}

interface NbpRateResponse {
    table: string;
    currency: string;
    code: string;
    rates: RateData[];
}

const NBP_API_URL = 'https://api.nbp.pl/api/exchangerates/rates';

const simulateBidAskFromMid = (mid: number) => {
    const SPREAD_MARGIN = 0.02;
    return {
        bid: parseFloat((mid * (1 - SPREAD_MARGIN)).toFixed(4)),
        ask: parseFloat((mid * (1 + SPREAD_MARGIN)).toFixed(4))
    };
};

/**
 * Pobiera kurs średni (z tabeli A lub B) i symuluje kursy 'bid' i 'ask'.
 * Zakłada 2% spreadu (kupno 0.98 * mid, sprzedaż 1.02 * mid).
 * @param currencyCode - Kod waluty do pobrania (np. 'EUR', 'USD').
 * @returns Obiekt z obliczonymi kursami 'bid' i 'ask'.
 * @throws Błąd, jeśli waluta nie zostanie znaleziona lub wystąpi błąd NBP.
 */
export const getCurrencyRates = async (currencyCode: string): Promise<{ bid: number, ask: number }> => {
    const code = currencyCode.toLowerCase();

    const fetchFromTable = async (table: 'a' | 'b') => {
        const response = await axios.get<NbpRateResponse>(`${NBP_API_URL}/${table}/${code}/?format=json`);
        return response.data.rates[0].mid;
    };

    try {
        const mid = await fetchFromTable('a');
        return simulateBidAskFromMid(mid);
    } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 404) {
            throw new Error('Błąd połączenia z NBP.');
        }
    }

    try {
        const mid = await fetchFromTable('b');
        return simulateBidAskFromMid(mid);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            throw new Error(`Nie znaleziono waluty ${currencyCode} w tabelach A i B.`);
        }
        throw new Error('Błąd połączenia z NBP.');
    }
};