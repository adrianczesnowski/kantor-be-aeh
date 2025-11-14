import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("Brak zdefiniowanego MONGO_URI w pliku .env");
    process.exit(1);
}

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB połączone: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Błąd połączenia z MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;