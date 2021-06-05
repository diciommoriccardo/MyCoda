import Router from 'express';
import Pharma from '../../models/pharma.model.js';
import {SUCCESS_ITA} from '../../config/constants.js';

const router = new Router()

router.post('/all', function(req, res){
    new Pharma(req.body)
    .then((pharma) =>{
        pharma.getAll()
        .then((result) =>{
            res.status(201).json({result, message: SUCCESS_ITA.DEFAULT})
        })
        .catch((err) =>{
            res.status(500).json({error: {message: err}})
        })
    })
    
})

export default router