import Router from 'express';
import Payment from '../../models/payment.model.js';
import Message from '../../models/message.model.js';
import Session from '../../models/session.model.js';
import Pharmacy from '../../models/pharmacy.model.js';
import User from '../../models/user.model.js';
import notification from '../../helpers/notifications.js';
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
            piva: req.user.id
        }

        new Pharmacy(pharmacy).then(pharmacy => pharmacy.findByCf())
        .then(pharmacy => {
            const payeeEmail = pharmacy[0].paypalEmail;
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
                    paypalId: paymentInfo.id,
                    storageKey: 3,
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
                    .then(message => {
                        let data = [];
                        const {id, mittente, time, content, stato, tipo, idSession} = message;
                        const approvalUrl = paymentInfo.approvalUrl;

                        new User({cf: req.params.id}).then(user => user.findByCf())
                        .then(receiver => {
                            console.log(receiver)
                            data.push({
                                pushToken: receiver[0].notificationToken,
                                body: `Nuovo pagamento richiesto: ${content}`,
                                senderId: pharmacy[0].piva,
                                sender: `${pharmacy[0].ragSociale}`
                            });
                            console.log(data)

                            notification.setData(data)
                            .then(messages => notification.sendNotifications(messages))
                        })
                        
                        return res.status(201).json({
                            payment: {
                                id: result[0].id,
                                cfUtente: result[0].cfUtente,
                                pivaFarma: result[0].pivaFarma,
                                somma: result[0].somma,
                                description: result[0].desc,
                                time: result[0].time,
                                status: result[0].stato,
                                paypalId: result[0].paypalId, 
                                approvalUrl
                            },
                            message: {
                                id,
                                mittente,
                                time,
                                content,
                                stato,
                                tipo,
                                idSession
                            },
                        })
                    })
                    .catch(err => res.status(500).json(err))
                })
            })
        })
    })
    .catch(err => { return res.status(500).json({error: {message: err}})})

})

export default router