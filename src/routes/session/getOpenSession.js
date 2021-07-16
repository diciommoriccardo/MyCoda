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
    .then(result => {
        return Promise.all(result.map(({id, pivaFarma, cfUtente, time}) => {
            return new Promise((resolve) => {
                new Message({idSession: id})
                .then(message => message.lastMessageBySession())
                .then(last => {
                    (type === 'user' ? new User({ cf: cfUtente }) : new Pharmacy({ piva: pivaFarma }))
                    .then(result => result.findByCf())
                    .then(user => resolve({
                        id,
                        cfUtente: cfUtente,
                        pivaFarma: pivaFarma,
                        nome: (type === 'user') ? user[0].nome + " " + user[0].cognome : user[0].ragSociale,
                        time: time,
                        message: {
                            content: last[0].content,
                            time: last[0].time,
                            mittente: last[0].mittente,
                            stato: last[0].stato
                        } 
                    }))
                    .catch(err => {console.log(err); return res.status(500).json({err: { message: err }})})
                })
            })
        }))
    })
    .then(result => res.status(201).json(result))
    .catch(err => { 
        console.log(err);
        return res.status(500).json({error: { message: err }})
    })
})

export default router