import Router from 'express';
import User from '../../models/user.model.js';
import jwt from '../../helpers/jwt.js';
import {JWT} from '../../config/constants.js';
import {ERRORS} from '../../config/constants.js';
import {SUCCESS_ITA} from '../../config/constants.js';
const router = Router();

router.get('/:cf', function(req, res){
    if(!req.body){res.status(400).json({message: 'Content cannot be empty'})}
        if(!req.body.cf){ res.status(400).json({message: 'Cf are required'})}

        var user = new User({
            cf: req.body.cf
        })

        user.findByCf(user.cf)
        .then( (result) =>{
            res.status(201).json({message: SUCCESS_ITA.DEFAULT, result: result})
        })
        .catch( (err) => {res.status(500).json({ message: err})})
});

export default router;