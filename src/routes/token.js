import Router from 'express';
import jwt from '../helpers/jwt.js';
import UsersHelper from '../helpers/Users.js';
import JWT from '../config/constants.js';
import ERRORS from '../config/constants.js';

const router = Router();

router.post('/', (req, res) => {
    if (!req.body.refresh_token) return res.status(403).send({ error: 'Forbidden' });
    const refresh_token = req.body.refresh_token;
    new UsersHelper({ refresh_token }).findByRefreshToken()
        .then(({_id}) => {
            const access_token = jwt.signAccessToken(_id);
            return res.status(201).send({ access_token, expires_in: JWT.EXPIRES_IN });
        })
        .catch((error) => { return res.status(401).send({ error: ERRORS.INVALID_REFRESH_TOKEN }); })
});

export default router;