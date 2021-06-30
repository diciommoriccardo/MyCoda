import Router from 'express';
import Payment from '../../models/payment.model.js';
import {SUCCESS_ITA} from '../../config/constants.js';

const router = Router();

router.get('/me/payments', function(req, res) {
    new Payment(req.user)
    .then(payment => payment.findByUser())
    .then(result =>{ return res.status(201).json({message: SUCCESS_ITA.DEFAULT, result: result}); })
    .catch(err => { return res.status(500).json({error: { message: err}})})
});

export default router;