import jwt from 'jsonwebtoken';
import { JWT } from '../config/constants';

const jwtHelper = {
    sign: (payload) => {
        return jwt.sign(payload, JWT.SECRET_KEY, { expiresIn: JWT.EXPIRES_IN });
    },
    verify: (token, callback) => {
        return jwt.verify(token, JWT.SECRET_KEY, callback);
    },
};

export default jwtHelper;