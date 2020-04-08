import mongoose from 'mongoose';
import { Logger } from './logger';

export class MongoClient {
  static async init(): Promise<void> {
    try {
      await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      });
      Logger.info('Initialized Database');
    } catch (error) {
      Logger.error('Database connection error', error.stack);
    }
  }
}
