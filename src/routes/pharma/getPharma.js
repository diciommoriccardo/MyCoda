import Router from 'express';
import Pharma from '../../models/pharma.model.js';
const router = Router();

router.get('/:piva', function(req, res){
    if(!req.body){res.status(400).json({error: {message:'Content cannot be empty'}})}
        if(!req.body.piva){ res.status(400).json({error: {message: 'P.IVA are required'}})}

        new Pharma(req.body)
        .then((pharma) => {
            pharma.findByCf(pharma.piva)
            .then( (result) =>{
                res.status(201).send(result)
            })
            .catch( (err) => {res.status(500).json({error: { message: err}})})
        })

        
});

export default router;