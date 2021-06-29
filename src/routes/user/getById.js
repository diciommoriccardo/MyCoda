import Router from 'express';
import User from '../../models/user.model.js';
import jwt from '../../helpers/jwt.js';
import {JWT} from '../../config/constants.js';
import {ERRORS} from '../../config/constants.js';
import {SUCCESS_ITA} from '../../config/constants.js';

const router = Router();

router.get('/me', function(req, res) {
    new User({cf: req.user.cf})
    .then(user => user.findByCf(user.cf))
    .then(row => {
        const { cf, nome, cognome, numTel, email } = row;
        return res.status(201).json({
            cf,
            nome,
            cognome,
            numTel,
            email,
        });
    })
    .catch(err => { return res.status(500).json({error: { message: err}})})
});

export default router;