import Router from 'express';
import Pharma from '../../models/pharma.model.js';

const router = new Router()

router.get('/all', function(req, res){
    if(!req.body.piva){res.status(400).json({error: {message: 'P.IVA is required'}})}

    new Pharma(req.body)
    .then((pharma) =>{
        pharma.getAll()
        .then((result) =>{
            res.status(201).json({result, message: SUCCESS_ITA.REGISTER})
        })
        .catch((err) =>{
            res.status(500).json({error: {message: err}})
        })
    })
})