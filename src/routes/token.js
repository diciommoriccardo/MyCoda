import Router from 'express';
import jwt from '../helpers/Jwt';
import { JWT, ERRORS } from '../config/constants';

const router = Router();

router.post('/', (req, res) => {
    if (!req.body.refresh_token) return res.status(403).send({ error: 'Forbidden' });
    const refresh_token = req.body.refresh_token;
    jwt.verify(refresh_token)
        .then(({type, _id}) => {
            if (type && type !== JWT.TYPES.REFRESH_TOKEN.NAME) throw new Error(ERRORS.INVALID_REFRESH_TOKEN);
            const access_token = jwt.signAccessToken(_id);
            return res.status(201).send({ access_token, expires_in: JWT.TYPES.ACCESS_TOKEN.EXPIRES_IN });
        })
        .catch((error) => { return res.status(401).send({ error: error.message }); })
});

export default router;