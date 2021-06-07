import Router from 'express';
import Pharmacy from '../../models/pharmacy.model.js';
const router = Router();

router.get('/:piva', function(req, res){
    if(!req.body) return res.status(400).json({error: {message:'Content cannot be empty'}});
    if(!req.body.piva) return res.status(400).json({error: {message: 'P.IVA are required'}});

    new Pharmacy (req.body)
    .then((pharma) => {
        pharma.findByCf(pharma.piva)
        .then( (result) =>{
            res.status(201).send(result)
        })
        .catch( (err) => {res.status(500).json({error: { message: err}})})
    })   
});

export default router;