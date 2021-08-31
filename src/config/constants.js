import dotenv from 'dotenv';
dotenv.config();

const JWT = {
  SECRET_KEY: process.env.ACCESS_TOKEN_SECRET,
  EXPIRES_IN: 3600,
};

const REFRESH_TOKEN = {
  LENGTH: 64
};

const ERRORS = {
  INVALID_REQUEST: 'Invalid request',
  INVALID_ACCESS_TOKEN: 'Invalid access token',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  TOKEN_EXPIRED: 'Access token expired',
  LOGIN: 'Login failed',
  REGISTRATION: 'Registration failed'
};

const SUCCESS_ITA = {
  DEFAULT: 'Operazione effettuata con successo',
  REGISTER: 'Registrazione avvenuta con successo!',
  PAYMENT: 'Pagamento avvenuto con successo!',
  CONNECTION: 'Connessione andata a buon fine!',
  LOGIN: "Login effettuato!"
}

const SUCCESS_EN = {
  DEFAULT: 'Operation succesfully complete!',
  REGISTER: 'Registration was successful',
  PAYMENT: 'Payment successful',
  CONNECTION: 'Connection successful'
}

const PAYPAL = {
  CLIENT_ID: process.env.CLIENT_ID,
  SECRET: process.env.PAYPAL_SECRET,
  API: 'https://api-m.sandbox.paypal.com'
}

const AWS = {
  ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
  ACCESS_SECRET_KEY: process.env.ACCESS_SECRET_KEY,
  BUCKET_NAME: 'mycodabucket',
  BUCKET_REGION: 'eu-central-1'
}

export {
  JWT,
  REFRESH_TOKEN,
  ERRORS,
  SUCCESS_ITA,
  SUCCESS_EN,
  PAYPAL,
  AWS
};
