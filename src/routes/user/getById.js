import Router from 'express';
import User from '../../models/user.model.js';
import jwt from '../../helpers/jwt.js';
import {JWT} from '../../config/constants.js';
import {ERRORS} from '../../config/constants.js';
import {SUCCESS_ITA} from '../../config/constants.js';

const router = Router();

router.get('/:cf', function(req, res) {
    if (!req.body) return res.status(400).json({error: {message: 'Content cannot be empty'}});
    if (!req.body.cf) return res.status(400).json({error: {message: 'Cf is required'}});

    new User({cf: req.body.cf})
    .then(user => { user.findByCf(user.cf) })
    .then(result =>{ return res.status(201).json({message: SUCCESS_ITA.DEFAULT, result: result})})
    .catch(err => { return res.status(500).json({error: { message: err}})})
});

export default router;