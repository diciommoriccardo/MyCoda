import jwt from 'jsonwebtoken';
import { JWT } from '../config/constants';

const jwtHelper = {
    signAccessToken: (_id) => {
        return jwt.sign({ _id, type: JWT.TYPES.ACCESS_TOKEN.NAME }, JWT.SECRET_KEY, { expiresIn: JWT.TYPES.ACCESS_TOKEN.EXPIRES_IN });
    },
    signRefreshToken: (_id) => {
        return jwt.sign({ _id, type: JWT.TYPES.REFRESH_TOKEN.NAME }, JWT.SECRET_KEY);
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