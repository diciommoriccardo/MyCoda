import Router from 'express';
import Pharma from '../../models/pharma.model.js';
const router = Router();

router.get('/:piva', function(req, res){
    if(!req.body){res.status(400).end('Content cannot be empty')}
        if(!req.body.piva){ res.status(400).end('P.IVA are required')}

        var pharma = new Pharma({
            piva: req.body.piva
        })

        pharma.findByCf(pharma.piva)
        .then( (result) =>{
            res.status(201).send(result)
        })
        .catch( (err) => {res.status(500).end({ message: err})})
});

export default router;