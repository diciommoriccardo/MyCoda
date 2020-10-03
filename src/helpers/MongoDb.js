import mongoose from 'mongoose';
import { DATABASE } from '../config/config';

class MongoDb {
  constructor() {
    this.db = mongoose.connection;
    this.uri = (process.env.NODE_ENV === 'development')
      ? `mongodb://${DATABASE.HOST}:${DATABASE.PORT}/${DATABASE.NAME}`
      : DATABASE.URI;
    this.db.on('open', () => { console.log(`Connected to ${this.uri}`); });
    this.db.on('reconnected', () => { console.log(`Reconnected to ${this.uri}`); });
    this.db.on('disconnected', () => { console.log(`Disconnected from ${this.uri}`); });
    this.db.on('error', (error) => {
      console.error(`Error in MongoDb: ${error.message}`);
      mongoose.disconnect();
    });
    this.connection = mongoose.connect(this.uri, DATABASE.OPTIONS).catch((error) => {});
  }
}

export default MongoDb;