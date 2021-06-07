import Router from 'express';
import jwt from '../../helpers/jwt.js';
import Pharmacy from '../../models/pharmacy.model.js';

const router = Router();

router.post('/login', function(req, res){
    if (!req.body) return res.status(400).json({error: {message: 'Content cannot be empty'}});
    if (!req.body.piva || !req.body.password) 
        return res.status(400).json({error: {message: 'P.IVA and password are required'}});

    new Pharmacy ( req.body )
    .then( (pharma) => {
        user.login()
        .then((row) => {
            var userAccessToken = jwt.signAccessToken({user: pharma.piva})
            res.status(201).json({accessToken: userAccessToken, row});
        })
    })
    .catch( (err) => {res.status(500).json({error: {message: err}})})
});

export default router;