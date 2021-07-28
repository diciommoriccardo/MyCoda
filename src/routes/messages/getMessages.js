import Router from 'express';
import Session from '../../models/session.model.js';
import Message from '../../models/message.model.js';
import Payment from '../../models/payment.model.js';

const router = Router();

router.get('/:id', (req, res) => {
    const UserId = req.user.id;
    const type  = req.user.type;
    const receiverId = req.params.id;
    const offset = req.query.offset && (parseInt(req.query.offset));
    const limit = req.query.limit && (parseInt(req.query.limit));

    const session = {
        ...(type === 'user') ? {cfUtente: UserId, pivaFarma: receiverId} : {cfUtente: receiverId, pivaFarma: UserId}
    };

    new Session( session )
    .then(session => session.findOpenSessionByBoth())
    .then(result => new Message({ idSession: result[0].id, mittente: receiverId }))
    .then(message => message.changeStatusForSession())
    .then(message => message.findBySession(offset, limit))
    .then(messages => 
        Promise.all(messages.map(({id, mittente, content, time, tipo, stato, idSession}) => {
            return new Promise((resolve, reject) => {
                switch (tipo) {
                    case 3:
                        const payment = {
                            time: time,
                            ...(type === 'user') ? {cfUtente: UserId, pivaFarma: receiverId} : {cfUtente: receiverId, pivaFarma: UserId}
                        };
                        new Payment(payment)
                        .then(payment => payment.find())
                        .then(result =>
                            resolve({
                                id,
                                mittente,
                                stato,
                                idSession,
                                payment: {
                                    id: result[0].id,
                                    receiverId: (type === 'user') ? result[0].cfUtente : result[0].pivaFarma,
                                    somma: result[0].somma,
                                    desc: result[0].desc,
                                    stato: result[0].stato,
                                    paypalId: result[0].paypalId
                                }
                        }))
                        .catch(err => reject(err))
                        break;
                
                    default:
                        resolve({
                            id, 
                            mittente, 
                            content, 
                            time, 
                            tipo, 
                            stato,
                            idSession
                        })
                        break;
                }
            })
        }))   
    )
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json({error : {message: err}}))
})

export default router