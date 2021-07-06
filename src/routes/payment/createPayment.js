import Router from 'express';
import Payment from '../../models/payment.model.js';
import {SUCCESS_ITA} from '../../config/constants.js';

const router = Router();

router.post('/:id', (req, res) => {
    if(!req.body.somma || req.body.somma == '') return res.status(400).json({ error: { message: 'Somma cannot be empty' }});
    if( !req.body.desc || req.body.desc == '') return res.status(400).json({error: {message: "Description must be send"}});
    const payment = {
        pivaFarma: req.user.id,
        cfUtente: req.params.id,
        somma: req.body.somma,
        desc: req.body.desc
    }
    
    new Payment(payment)
    .then(payment => payment.create())
    .then(result => { return res.status(201).json({result, message: SUCCESS_ITA.DEFAULT})})
    .catch(err => { return res.status(500).json({error: {message: err}})})

})

export default router