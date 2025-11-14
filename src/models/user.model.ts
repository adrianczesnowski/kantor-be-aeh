import { Schema, model, Document } from 'mongoose';

interface IWallet {
    currency: string;
    balance: string;
}

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    language: string;
    wallets: IWallet[];
    createdAt: Date;
    updatedAt: Date;
}

const WalletSchema = new Schema<IWallet>({
    currency: { type: String, required: true },
    balance: { type: String, required: true, default: '0.00' }
}, { _id: false });

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: [true, 'Adres e-mail jest wymagany.'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Proszę podać prawidłowy adres e-mail.']
    },
    passwordHash: {
        type: String,
        required: [true, 'Hasło jest wymagane.']
    },
    language: {
        type: String,
        default: 'pl'
    },
    wallets: {
        type: [WalletSchema],
        default: [{ currency: 'PLN', balance: '0000.00' }]
    }
}, {
    timestamps: true
});

const User = model<IUser>('User', UserSchema);

export default User;
