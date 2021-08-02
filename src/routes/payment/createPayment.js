import Router from 'express';
import Payment from '../../models/payment.model.js';
import Message from '../../models/message.model.js';
import Session from '../../models/session.model.js';
import Pharmacy from '../../models/pharmacy.model.js';
import Paypal from '../../helpers/paypal.js';
import {SUCCESS_ITA} from '../../config/constants.js';

const router = Router();

router.post('/:id', (req, res) => {
    if(!req.body.somma || req.body.somma == '') return res.status(400).json({ error: { message: 'Somma cannot be empty' }});
    if( !req.body.desc || req.body.desc == '') return res.status(400).json({error: {message: "Description must be send"}});

    const { somma, desc } = req.body
    Paypal.getAccessToken()
    .then(accessToken => {

        const pharmacy = {
            pivaFarma: req.user.id
        }

        new Pharmacy(pharmacy)
        .then(pharmacy => {
            const payeeEmail = pharmacy.paypalEmail;
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
                    new Session({
                        cfUtente: result[0].cfUtente,
                        pivaFarma: result[0].pivaFarma
                    })
                    .then(session => session.findOpenSessionByBoth())
                    .then(openSession => new Message({
                        mittente: result[0].pivaFarma,
                        content: `${result[0].desc} - ${result[0].somma}`,
                        time: result[0].time,
                        idSession: openSession[0].id,
                        tipo: 3
                    }))
                    .then(message => message.create())
                    .then(() => {
                        const access_token = paymentInfo.access_token;
                        const approvalUrl = paymentInfo.approvalUrl;
                        return res.status(201).json({result: result[0], access_token, approvalUrl, message: SUCCESS_ITA.DEFAULT})
                    })
                    .catch(err => res.status(500).json(err))
                })
            })
        })
    })
    .catch(err => { return res.status(500).json({error: {message: err}})})

})

export default router