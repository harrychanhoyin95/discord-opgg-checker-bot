import mongoose from 'mongoose';
import { Logger } from './logger';

export class Database {
  static async init(): Promise<boolean> {
    mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
      .then(() => {
        Logger.info('Initialized Database')
      })
      .catch((error) => {
        Logger.error('Database connection error', error)
      });
    return true;
  }
}