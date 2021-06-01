import Router from 'express';
import Pharma from '../../models/pharma.model.js';
const router = Router();

router.get('/:piva', function(req, res){
    if(!req.body){res.status(400).json({message:'Content cannot be empty'})}
        if(!req.body.piva){ res.status(400).json({message: 'P.IVA are required'})}

        var pharma = new Pharma({
            piva: req.body.piva
        })

        pharma.findByCf(pharma.piva)
        .then( (result) =>{
            res.status(201).send(result)
        })
        .catch( (err) => {res.status(500).json({ message: err})})
});

export default router;