import Router from 'express';
import Paypal from '../../helpers/paypal.js';
import Payment from '../../models/payment.model.js';

const router = Router();

router.get('/success', (req, res) => {
    const { paymentId } = req.query 

    Paypal.capture(paymentId)
    .then(capture => {
        const id = capture.id;
        
        return new Payment({
            id
        })
        .then(payment => payment.changeStatus(capture.state))
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).json(err))
    })
    .catch(err => res.status(500).json(err))
})

export default router