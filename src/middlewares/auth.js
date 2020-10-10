import jwt from '../helpers/Jwt';
import { JWT, ERRORS } from '../config/constants';

const authMiddleware = (req, res, next) => {
    if (!req.headers.authorization || req.headers.authorization.split(' ')[0] !== 'Bearer') 
        return res.status(403).send({ error:'Forbidden' });
    
    const bearer = req.headers.authorization.split(' ')[1];

    jwt.verify(bearer)
        .then((verified) => {
            if (verified.type && verified.type !== JWT.TYPES.ACCESS_TOKEN.NAME) throw new Error(ERRORS.INVALID_ACCESS_TOKEN);
            req.user = verified;
            next();
        })
        .catch((error) => { 
            const message = error.name === 'TokenExpiredError' ? ERRORS.TOKEN_EXPIRED : ERRORS.INVALID_ACCESS_TOKEN;
            return res.status(401).send({ error: message });
        });
};

export default authMiddleware;