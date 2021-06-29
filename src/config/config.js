import dotenv from 'dotenv';
dotenv.config();

const environment = process.env.NODE_ENV || 'development';
console.log(`Server environment is ${environment}.`);

const SERVER = {
  HOST: process.env.HOST || '0.0.0.0',
  PORT: process.env.PORT || '8080',
  HOST_SECURE: process.env.HOST_SECURE || '0.0.0.0',
  PORT_SECURE: process.env.PORT_SECURE || '8433',
};

const DATABASE = {
  HOST: process.env.DATABASE_HOST || '127.0.0.1',
  PORT: process.env.DATABASE_PORT || '3306',
  NAME: process.env.DATABASE_NAME,
  USER: process.env.DATABASE_USER,
  PASS: process.env.DATABASE_PASS,
  OPTIONS: {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  },
};

export {
  SERVER,
  DATABASE,
};
