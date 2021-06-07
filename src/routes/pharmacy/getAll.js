import Router from 'express';
import Pharmacy from '../../models/pharmacy.model.js';
import {SUCCESS_ITA} from '../../config/constants.js';

const router = new Router()

router.get('/', function(req, res){
    new Pharmacy (req.body)
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