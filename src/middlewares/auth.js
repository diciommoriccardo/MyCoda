import jwt from '../helpers/jwt';

const authMiddleware = (req, res, next) => {
    const bearer = req.header('Bearer') || null;

    if (bearer === null) return res.status(403).send('Forbidden');

    jwt.verify(token)
    .then((verified) => {
        req.user = verified;
        next();
    })
    .catch(() => {
        res.status(401).send('Unauthorized');
    });
};

export default authMiddleware;