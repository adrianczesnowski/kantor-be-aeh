import { Request, Response } from 'express';
import * as AuthService from '../services/auth.service';

/**
 * @desc Rejestracja nowego użytkownika
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Proszę podać e-mail i hasło.' });
        }

        const newUser = await AuthService.registerUser({ email, password });

        const userResponse = {
            _id: newUser._id,
            email: newUser.email,
            language: newUser.language,
            wallets: newUser.wallets,
            createdAt: newUser.createdAt
        };

        res.status(201).json({ message: 'Użytkownik został pomyślnie zarejestrowany.', user: userResponse });
    } catch (error: any) {
        if (error.message.includes('istnieje')) {
            return res.status(409).json({ message: error.message });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error(error);
        res.status(500).json({ message: 'Błąd serwera podczas rejestracji.' });
    }
};

/**
 * @desc Logowanie użytkownika
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Proszę podać e-mail i hasło.' });
        }

        const { token, user } = await AuthService.loginUser({ email, password });

        const userResponse = {
            _id: user._id,
            email: user.email,
            language: user.language,
            wallets: user.wallets
        };

        res.status(200).json({
            message: 'Logowanie zakończone sukcesem.',
            token,
            user: userResponse
        });

    } catch (error: any) {
        if (error.message.includes('Nieprawidłowy')) {
            return res.status(401).json({ message: error.message });
        }
        console.error(error);
        res.status(500).json({ message: 'Błąd serwera podczas logowania.' });
    }
};
