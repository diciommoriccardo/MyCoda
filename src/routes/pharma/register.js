import Router from 'express';
import {SUCCESS_ITA} from '../../config/constants.js';
import Pharma from '../../models/pharma.model.js'

const router = Router();

router.post('/register', function(req, res){
    if(!req.body){res.status(400).json({error: {message: 'Content cannot be empty'}})}

        new Pharma(req.body)
        .then((pharma) => {
            pharma.register()
            .then((result) => {
            res.status(201).json({result, message: SUCCESS_ITA.REGISTER})
            })
            .catch((err) => {
                res.status(500).json({error: {message: err}})
            })            
        })
        
});

export default router;