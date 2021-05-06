import Router from 'express';
import jwt from '../helpers/jwt.js';
import user from '../controller/user.controller';
import JWT from '../config/constants.js';
import ERRORS from '../config/constants.js';
import router from './token.js';

router.get('/user/:id', (req, res) => {
    if (!req.body.refresh_token) return res.status(403).send({ error: 'Forbidden' });
})