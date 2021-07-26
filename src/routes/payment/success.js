import Router from 'express';
import Paypal from '../../helpers/paypal.js';
import Payment from '../../models/payment.model.js';

const router = Router();

router.get('/success', (req, res) => {
    if (!req.headers.authorization || req.headers.authorization.split(' ')[0] !== 'Bearer') 
        return res.status(403).send({ error:'Forbidden' });
    
    const bearer = req.headers.authorization.split(' ')[1];

    const { orderId } = req.query.token;

    Paypal.capture(orderId, bearer)
    .then(capture => {
        console.log(capture)
        const id = capture.id;
        console.log(id)

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