import jwt from '../helpers/Jwt';

const authMiddleware = (req, res, next) => {
    if (!req.headers.authorization || req.headers.authorization.split(' ')[0] !== 'Bearer') 
        return res.status(403).send('Forbidden');
    
    const bearer = req.headers.authorization.split(' ')[1];

    jwt.verify(bearer, (error, verified) => {
        if (error) return res.status(401).send('Unauthorized');
        req.user = verified;
        next();
    })
};

export default authMiddleware;