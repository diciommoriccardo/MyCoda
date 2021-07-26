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
    Paypal.getAccessToken()
    .then(accessToken => {
        Paypal.create(somma, payeeEmail, accessToken)
        .then(paymentObj => {
            for(let i = 0; i < paymentObj.data.links.length; i++){
                if(paymentObj.data.links[i].rel === 'approve'){
    
                  const paymentInfo = {
                      approvalUrl: paymentObj.data.links[i].href,
                      id: paymentObj.data.id,
                      stato: paymentObj.data.status,
                      access_token: accessToken
                  }
                  return paymentInfo;
                }
              }
        })
        .then(paymentInfo => {
            const payment = {
                pivaFarma: req.user.id,
                cfUtente: req.params.id,
                somma,
                desc,
                stato: paymentInfo.stato,
                paypalId: paymentInfo.id
            }
            new Payment(payment)
            .then(payment => payment.create())
            .then(result => { 
                const access_token = paymentInfo.access_token;
                const approvalUrl = paymentInfo.approvalUrl;
                return res.set({
                    'Authorization': access_token,
                    'location': approvalUrl
                })
                .status(201).json({result: result[0], message: SUCCESS_ITA.DEFAULT})
            })
        })
    })
    .catch(err => { return res.status(500).json({error: {message: err}})})

})

export default router