import dotenv from 'dotenv';
dotenv.config();

const JWT = {
  SECRET_KEY: process.env.JWT_SECRET,
  EXPIRES_IN: 3600,
};

const REFRESH_TOKEN = {
  LENGTH: 64,
}

const SPOTIFY = {
  CLIENT_ID: process.env.SPOTIFY_CLIENT,
  SECRET: process.env.SPOTIFY_SECRET,
  REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
  SCOPES: ['user-read-private', 'user-read-email', 'app-remote-control'],
  STATE: {
    NAME: 'state',
    LENGTH: 32,
    COOKIE_MAX_AGE: 60 * 60 * 1000,
  },
};

const ERRORS = {
  INVALID_REQUEST: 'Invalid request',
  INVALID_ACCESS_TOKEN: 'Invalid access token',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  TOKEN_EXPIRED: 'Access token expired',
};

export {
  JWT,
  REFRESH_TOKEN,
  ERRORS,
  SPOTIFY,
};
