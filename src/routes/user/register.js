import Router from 'express';
import jwt from '../../helpers/jwt.js';
import {JWT, SUCCESS_ITA} from '../../config/constants.js';
import {ERRORS} from '../../config/constants.js';
import {SUCCESS_EN} from '../../config/constants.js';
import User from '../../models/user.model.js'

const router = Router();

router.post('/register', function(req, res){
    if(!req.body){res.status(400).json({error: {message: 'Content cannot be empty'}})}

        new User(req.body)
        .then((user) => {
            user.register()
            .then((result) => {
            res.status(201).json({result, message: SUCCESS_ITA.REGISTER})
            })
            .catch((err) => {
                res.status(500).json({error: {message: err}})
            })            
        })
        
});

export default router;