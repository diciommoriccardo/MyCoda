import Router from 'express';
import Payment from '../../models/payment.model.js';
import {SUCCESS_ITA} from '../../config/constants.js';

const router = Router();

router.get('/:id', (req, res) => {
    if(!req.body.id) { return res.status(400).json({error: {message: "CF is required"}}) }

    new Payment({
        pivaFarm: req.user.piva,
        cfUtente: req.params.cf,
        somma: req.body.somma
    })
    .then(payment => payment.create())
    .then(result => { return res.status(201).json({result: result, message: SUCCESS_ITA.DEFAULT})})
    .catch(err => { return res.status(500).json({error: {message: err}})})

})

export default router