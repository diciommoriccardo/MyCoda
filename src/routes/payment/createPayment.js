import Router from 'express';
import Payment from '../../models/payment.model.js';
import Paypal from '../../helpers/paypal.js';
import {SUCCESS_ITA} from '../../config/constants.js';

const router = Router();

router.post('/:id', (req, res) => {
    if(!req.body.somma || req.body.somma == '') return res.status(400).json({ error: { message: 'Somma cannot be empty' }});
    if( !req.body.desc || req.body.desc == '') return res.status(400).json({error: {message: "Description must be send"}});
    if(!req.body.payeeEmail || req.body.payeeEmail == '') return res.status(400).json({ error: { message: 'Payee Email must be send' }});
    const { somma, desc, payeeEmail } = req.body
    
    Paypal.create(somma, payeeEmail)
    .then(paymentObj => {
        for(let i = 0; i < paymentObj.result.links.length; i++){
            if(paymentObj.result.links[i].rel === 'approve'){

              const paymentInfo = {
                  approvalUrl: paymentObj.result.links[i].href,
                  id: paymentObj.result.id,
                  stato: paymentObj.result.status
              }
              return paymentInfo;
            }
          }
    })
    .then(paymentInfo => {
        const payment = {
            id: paymentInfo.id,
            pivaFarma: req.user.id,
            cfUtente: req.params.id,
            somma,
            desc,
            stato: paymentInfo.stato
        }
        new Payment(payment)
        .then(payment => payment.create())
        .then(result => { 
            const approvalUrl = paymentInfo.approvalUrl;
            return res.status(201).json({result, approvalUrl, message: SUCCESS_ITA.DEFAULT})
        })
    })
    .catch(err => { return res.status(500).json({error: {message: err}})})

})

export default router