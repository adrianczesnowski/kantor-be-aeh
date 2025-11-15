import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET nie jest zdefiniowany w pliku .env");
}

/**
 * Rejestruje nowego użytkownika i zapisuje go w bazie danych.
 * @param userData - Obiekt zawierający e-mail i hasło użytkownika.
 * @returns Obiekt nowo zarejestrowanego użytkownika.
 * @throws Błąd, jeśli użytkownik o podanym e-mailu już istnieje.
 */
export const registerUser = async (userData: Pick<IUser, 'email'> & { password: string }): Promise<IUser> => {
    const { email, password } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('Użytkownik o podanym adresie e-mail już istnieje.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
        email,
        passwordHash,
    });

    await newUser.save();
    return newUser;
};

/**
 * Weryfikuje dane logowania użytkownika i generuje token JWT.
 * @param credentials - Obiekt zawierający e-mail i hasło.
 * @returns Obiekt z tokenem JWT i danymi użytkownika.
 * @throws Błąd, jeśli e-mail lub hasło są nieprawidłowe.
 */
export const loginUser = async (credentials: Pick<IUser, 'email'> & { password: string }): Promise<{ token: string, user: IUser }> => {
    const { email, password } = credentials;

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Nieprawidłowy e-mail lub hasło.');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new Error('Nieprawidłowy e-mail lub hasło.');
    }

    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return { token, user };
};
