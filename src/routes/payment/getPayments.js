import Router from 'express';
import Payment from '../../models/payment.model.js';
import {SUCCESS_ITA} from '../../config/constants.js';

const router = Router();

router.get('', (req, res) => {
    const { id, type } = req.user;
    const payment = {
        ...(type === 'user' ? { cfUtente: id } : { pivaFarma: id })
    };


    new Payment(payment)
    .then(payment => (type === 'user' ? payment.findByUser() : payment.findByPharma()))
    .then(result => res.status(200).json(result))
    .catch(err => { return res.status(500).json({error: {message: err}})})

})

export default router