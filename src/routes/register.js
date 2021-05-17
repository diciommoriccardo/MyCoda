import Router from 'express';
import jwt from '../helpers/jwt.js';
import {JWT} from '../config/constants.js';
import {ERRORS} from '../config/constants.js';
import User from '../models/user.model.js'

const router = Router();

router.post('/register', function(req, res){
    if(!req.body){res.status(400).send('Content cannot be empty')}

        var user = new User({
            cf: req.body.cf,
            nome: req.body.nome,
            cognome: req.body.cognome,
            numTel: req.body.numTel,
            email: req.body.email,
            password: req.body.password
        })
        
        user.register()
        .then( (result) => {res.status(201).json({result})})
        .catch( (err) => {res.status(500).json({error: err.toString()})})
});

export default router;