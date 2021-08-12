import Router from 'express';
import Session from '../../models/session.model.js';
import Message from '../../models/message.model.js';
import Pharmacy from '../../models/pharmacy.model.js';
import User from '../../models/user.model.js';

const router = Router();

router.get('/open', (req, res) => {
    const { id, type } = req.user;
    const session = {
        ...(type === 'user' ? { cfUtente: id } : { pivaFarma: id })
    };

    new Session( session )
    .then(session => type === 'user' ? session.findOpenSessionByUser() : session.findOpenSessionByPharma())
    .then(result => 
        Promise.all(result.map(({ id: sessionId, pivaFarma, cfUtente, time }) => {
            return new Promise((resolve, reject) => {
                return new Message({ idSession: sessionId, mittente: id})
                    .then(message => Promise.all([message.findBySession(0, 1), message.getNewMessagesCount()]))
                    .then(([[lastMessage], newMessagesCount]) => {
                        (type === 'user' ? new Pharmacy({ piva: pivaFarma }) : new User({ cf: cfUtente }))
                        .then(result => result.findByCf())
                        .then(user => resolve({
                            sessionId,
                            userId: (type === 'user') ? pivaFarma : cfUtente,
                            displayName: (type === 'user') ? user[0].ragSociale : `${user[0].nome} ${user[0].cognome}`,
                            createdAt: time,
                            newMessagesCount,
                            lastMessage,
                        }))
                        .catch(error => reject(error));
                })
            })}
        ))
    )
    .then(result => res.status(200).json(result))
    .catch(err => res.status(err.data.status).json({error: err.data}))
})

export default router