import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import connectDB from './config/db';
import healthRouter from './routes/health.routes';
import authRouter from './routes/auth.routes';
// import walletRouter from './routes/wallet.routes';
// import transactionRouter from './routes/transaction.routes';
// import exchangeRouter from './routes/exchange.routes';
// import userRouter from './routes/user.routes';
// import rateRoutes from './routes/rate.routes';

const app: Application = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get('/api', (req: Request, res: Response) => {
    res.send('API działa poprawnie!!!');
});

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
// app.use('/api/wallets', walletRouter);
// app.use('/api/transactions', transactionRouter);
// app.use('/api/exchange', exchangeRouter);
// app.use('/api/users', userRouter);
// app.use('/api/rates', rateRoutes);

export default app;
