import { Schema, model, Document, Types } from 'mongoose';

export type TransactionType = 'topup' | 'exchange' | 'withdraw';

export interface ITransaction extends Document {
    userId: Types.ObjectId;
    type: TransactionType;
    fromCurrency?: string;
    toCurrency?: string;
    fromAmount?: string;
    toAmount?: string;
    rateUsed?: string;
    timestamp: Date;
}

const TransactionSchema = new Schema<ITransaction>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['topup', 'exchange', 'withdraw'],
        required: true
    },
    fromCurrency: { type: String },
    toCurrency: { type: String },
    fromAmount: { type: String },
    toAmount: { type: String },
    rateUsed: { type: String },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Transaction = model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;