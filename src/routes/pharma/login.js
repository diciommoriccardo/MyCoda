import express, { Router } from 'express';
import jwt from '../../helpers/jwt.js';
import Pharma from '../../models/pharma.model.js';

const router = Router();

router.post('/login', function(req, res){
    if(!req.body){ res.status(400).end('Content cannot be empty')}
    if(!((req.body.piva) && (req.body.password))){ res.status(400).end('P.IVA and password are required')}

        new Pharma( req.body )
        .then( (pharma) => {
            user.login()
            .then((row) => {
                var userAccessToken = jwt.signAccessToken({user: pharma.piva})
                res.status(201).json({accessToken: userAccessToken, row});
            })
        })
        .catch( (err) => {res.status(500).json({message: err})})
});

export default router;