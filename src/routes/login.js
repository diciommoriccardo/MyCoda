import express, { Router } from 'express';
import jwt from '../helpers/jwt.js';
import {JWT} from '../config/constants.js';
import {ERRORS} from '../config/constants.js';
import User from '../models/user.model.js';

const router = Router();

router.post('/login', function(req, res){
    if(!req.body){ res.status(400).end('Content cannot be empty')}
    if(!((req.body.cf) && (req.body.password))){ res.status(400).end('Cf and password are required')}

        var user = new User( req.body )
        console.log(user)

        user.login()
        .then(result => {
            console.log(result)
            var userAccessToken = jwt.signAccessToken(result.cf)
            res.status(201).end(userAccessToken);
        })
        .catch( (err) => {res.status(500).end(ERRORS.LOGIN)})
});

export default router;