import User from '../models/user.model';
import bcrypt from 'bcryptjs';

/**
 * Aktualizuje preferowany język użytkownika.
 * @param userId - ID użytkownika.
 * @param language - Nowy kod języka (np. "en", "pl").
 */
export const updateUserLanguage = async (userId: string, language: string) => {
    if (!/^[a-z]{2}$/.test(language)) {
        throw new Error('Nieprawidłowy format kodu języka. Oczekiwano dwóch małych liter.');
    }

    const user = await User.findByIdAndUpdate(userId, { language }, { new: true });
    if (!user) {
        throw new Error('Użytkownik nie został znaleziony.');
    }
    return user;
};

/**
 * Aktualizuje hasło użytkownika.
 * @param userId - ID użytkownika.
 * @param oldPassword - Obecne hasło do weryfikacji.
 * @param newPassword - Nowe hasło.
 */
export const updateUserPassword = async (userId: string, oldPassword: string, newPassword: string) => {
    if (!newPassword || newPassword.length < 6) {
        throw new Error('Nowe hasło musi mieć co najmniej 6 znaków.');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new Error('Użytkownik nie został znaleziony.');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) {
        throw new Error('Podane obecne hasło jest nieprawidłowe.');
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);

    await user.save();
};
