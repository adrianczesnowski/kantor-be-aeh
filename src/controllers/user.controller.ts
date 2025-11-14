import { Response } from 'express';
import * as UserService from '../services/user.service';
import { IAuthRequest } from '../middleware/auth.middleware';

/**
 * @desc Zmiana języka aplikacji
 * @route PUT /api/users/language
 * @access Private
 */
export const changeLanguage = async (req: IAuthRequest, res: Response) => {
    const userId = req.userId!;
    const { language } = req.body;

    if (!language) {
        return res.status(400).json({ message: 'Proszę podać kod języka.' });
    }

    try {
        const updatedUser = await UserService.updateUserLanguage(userId, language);
        res.status(200).json({
            message: 'Język został zaktualizowany.',
            language: updatedUser.language
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc Zmiana hasła
 * @route PUT /api/users/password
 * @access Private
 */
export const changePassword = async (req: IAuthRequest, res: Response) => {
    const userId = req.userId!;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Proszę podać obecne i nowe hasło.' });
    }

    try {
        await UserService.updateUserPassword(userId, oldPassword, newPassword);
        res.status(200).json({ message: 'Hasło zostało pomyślnie zmienione.' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
