import Router from 'express';
import Session from '../../models/session.model.js';
import Message from '../../models/message.model.js';
import Pharmacy from '../../models/pharmacy.model.js';

const router = Router();

router.get('', (req, res) => {
    const { id, type } = req.user;
    const session = {
        ...(type === 'user' ? { cfUtente: id } : { pivaFarma: id })
    };
    
    new Session( session )
    .then(session => type === 'user' ? session.findByUserNew() : session.findByPharmaNew())
    .then(result => { 
        console.log(result)
        return Promise.all(result.map(({id, pivaFarma, cfUtente, time}) => {
            return new Promise((resolve) => {
                new Message({idSession: id})
                .then(message => message.lastMessageBySession())
                .then(last => {
                    
                    new Pharmacy({ piva: pivaFarma})
                    .then(pharmacy => pharmacy.findByCf())
                    .then(pharma => {console.log(pharma); resolve({
                        cfUtente: cfUtente,
                        pivaFarma: pivaFarma,
                        ragSociale: pharma[0].ragSociale,
                        time: time,
                        message: {
                            content: last[0].content,
                            mittente: last[0].mittente,
                            time: last[0].time
                        }
                    })})    
                })
                .catch(err => res.status(500).json(err))
            })
        }))
     })
    .then(result => res.status(201).json(result))
    .catch(err => res.status(500).json({error: {message: err}}))

})

export default router