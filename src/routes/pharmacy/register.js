import Router from 'express';
import {SUCCESS_ITA} from '../../config/constants.js';
import Pharmacy from '../../models/pharmacy.model.js'

const router = Router();

router.post('/register', function(req, res){
    if (!req.body) return res.status(400).json({error: {message: 'Content cannot be empty'}});

    new Pharmacy (req.body)
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