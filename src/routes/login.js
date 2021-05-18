import express, { Router } from 'express';
import jwt from '../helpers/jwt.js';
import {JWT} from '../config/constants.js';
import {ERRORS} from '../config/constants.js';
import User from '../models/user.model.js';
import user from '../models/user.model.js';

const router = Router();

router.post('/login', function(req, res){
    if(!req.body){ res.status(400).end('Content cannot be empty')}
    if(!((req.body.cf) && (req.body.password))){ res.status(400).end('Cf and password are required')}

        new User( req.body )
        .then( (user) => {
            user.login()
            .then((row) => {
                var userAccessToken = jwt.signAccessToken({user: user.cf})
                var userOut = JSON.stringify(row)
                res.status(201).json({accessToken: userAccessToken, userOut});
            })
        })
        .catch( (err) => {res.status(500).json({message: err})})
});

export default router;