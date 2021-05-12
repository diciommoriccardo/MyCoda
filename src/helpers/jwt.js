import jwt from 'jsonwebtoken';
import {JWT}  from '../config/constants.js';

const jwtHelper = {
    signAccessToken: (payload) => {
        return jwt.sign( payload, JWT.SECRET_KEY, { expiresIn: JWT.EXPIRES_IN });
    },

    verify: (token) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, JWT.SECRET_KEY, (error, verified) => {
                error ? reject(error) : resolve(verified);
            });
        });
    },
};

export default jwtHelper;