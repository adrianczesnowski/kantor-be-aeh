import axios from 'axios';

const NBP_API_URL = 'https://api.nbp.pl/api/exchangerates';

interface Rate {
    no: string;
    effectiveDate: string;
    mid?: number;
    bid?: number;
    ask?: number;
}

interface NbpRateResponse {
    table: string;
    currency: string;
    code: string;
    rates: Rate[];
}

/**
 * Pobiera całą tabelę kursów (A, B lub C) z NBP.
 * @param table - Typ tabeli ('a', 'b' lub 'c').
 * @returns Lista kursów z danej tabeli.
 */
export const getRatesTable = async (table: 'a' | 'b' | 'c') => {
    try {
        const response = await axios.get<NbpRateResponse[]>(`${NBP_API_URL}/tables/${table}/?format=json`);

        if (response.data && response.data.length > 0) {
            return response.data[0].rates;
        }
        return [];
    } catch (error) {
        throw new Error(`Nie można pobrać aktualnych kursów walut z tabeli ${table}.`);
    }
};

/**
 * Pobiera historyczne kursy dla danej waluty z ostatnich X dni (z tabeli A lub B).
 * @param currencyCode - Kod waluty (np. 'EUR', 'THB').
 * @param days - Liczba dni do pobrania (np. 30).
 * @returns Lista historycznych kursów.
 */
export const getHistoricalRates = async (currencyCode: string, days: number) => {
    const limit = Math.min(days, 93);
    const code = currencyCode.toLowerCase();

    const tryFetchTable = async (table: 'a' | 'b'): Promise<NbpRateResponse> => {
        const url = `${NBP_API_URL}/rates/${table}/${code}/last/${limit}/?format=json`;
        const response = await axios.get<NbpRateResponse>(url);
        return response.data;
    };

    try {
        const dataA = await tryFetchTable('a');
        return dataA.rates;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            try {
                const dataB = await tryFetchTable('b');
                return dataB.rates;
            } catch (errorB) {
                if (axios.isAxiosError(errorB) && errorB.response?.status === 404) {
                    throw new Error(`Nie znaleziono danych historycznych dla waluty ${currencyCode} w tabelach A i B.`);
                }
                throw new Error('Nie można pobrać danych historycznych (błąd tabeli B).');
            }
        }

        throw new Error('Nie można pobrać danych historycznych (błąd tabeli A).');
    }
};