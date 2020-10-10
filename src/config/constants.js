import dotenv from 'dotenv';
dotenv.config();

const JWT = {
  SECRET_KEY: process.env.JWT_SECRET,
  TYPES: {
    ACCESS_TOKEN: {
      NAME: 'access',
      EXPIRES_IN: 10
    },
    REFRESH_TOKEN: {
      NAME: 'refresh'
    },
  }
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
  INVALID_ACCESS_TOKEN: 'Invalid access token',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  TOKEN_EXPIRED: 'Access token expired',
};

export {
  JWT,
  BOUNDARY_VALUES,
  ERRORS,
  SPOTIFY,
};
