import Router from 'express';
import jwt from '../helpers/jwt.js';
import User from '../models/user.model.js';
import { JWT } from '../config/constants.js';
import { ERRORS } from '../config/constants.js';

const router = Router();

router.post('/token', (req, res) => {
    if (!req.body.refresh_token) return res.status(403).json({ error: 'Forbidden' });
    const refresh_token = req.body.refresh_token;
    new User({ refresh_token }).findByRefreshToken()
        .then(({_id}) => {
            const access_token = jwt.signAccessToken(_id);
            return res.status(201).json({ access_token, expires_in: JWT.EXPIRES_IN });
        })
        .catch((error) => { return res.status(401).json({ error: ERRORS.INVALID_REFRESH_TOKEN }); })
});

export default router;