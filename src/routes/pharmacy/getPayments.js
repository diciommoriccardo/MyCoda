import Router from 'express';
import Payment from '../../models/payment.model.js';
import {SUCCESS_ITA} from '../../config/constants.js';

const router = Router();

router.get('/me/payments', function(req, res) {
    new Payment({pivaFarm: req.user.id})
    .then(payment => payment.findByPharma())
    .then(result =>{ return res.status(200).json({message: SUCCESS_ITA.DEFAULT, result: result}); })
    .catch(err => { return res.status(500).json({error: { message: err}})})
});

export default router;