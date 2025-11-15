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

/**
 * Symuluje kurs kupna (bid) i sprzedaży (ask) na podstawie kursu średniego (mid).
 * Zakładamy spread +/- 2% (czyli 0.98 dla kupna i 1.02 dla sprzedaży).
 */
const simulateBidAskFromMid = (mid: number) => {
    const SPREAD_MARGIN = 0.02;
    return {
        bid: parseFloat((mid * (1 - SPREAD_MARGIN)).toFixed(4)),
        ask: parseFloat((mid * (1 + SPREAD_MARGIN)).toFixed(4))
    };
};

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