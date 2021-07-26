import Router from 'express';
import Paypal from '../../helpers/paypal.js';
import Payment from '../../models/payment.model.js';

const router = Router();

router.get('/success', (req, res) => {

    const { orderId } = req.query.token;
    console.log(orderId)

    Paypal.capture(orderId)
    .then(capture => {
        console.log(capture)
        const id = capture.id;
        console.log(id)

        return new Payment({
            paypalId: id
        })
        .then(payment => payment.changeStatus(capture.state))
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).json(err))
    })
    .catch(err => res.status(500).json(err))
})

export default router