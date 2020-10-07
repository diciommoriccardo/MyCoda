import dotenv from 'dotenv';
dotenv.config();

const JWT = {
  SECRET_KEY: process.env.JWT_SECRET,
  EXPIRES_IN: '1d',
};

const SPOTIFY = {
  CLIENT_ID: process.env.SPOTIFY_CLIENT,
  SECRET: process.env.SPOTIFY_SECRET,
  REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
  SCOPES: ['user-read-private', 'user-read-email'],
  STATE: {
    NAME: 'state',
    LENGTH: 32,
    COOKIE_MAX_AGE: 60 * 1000,
  },
};

const BOUNDARY_VALUES = {
  GROUP_CODE_LENGTH: 6,
  MAX_GROUP_SIZE: 5,
};

const ERRORS = {
  INVALID_REQUEST: 'Invalid request',
  TOKEN_EXPIRED: 'Token does not exist or it\'s expired',
};

export {
  JWT,
  BOUNDARY_VALUES,
  ERRORS,
  SPOTIFY,
};
